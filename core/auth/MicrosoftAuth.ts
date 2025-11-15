import fetch from 'node-fetch';

export interface MinecraftSession {
  accessToken: string;
  uuid: string;
  username: string;
}

export class MicrosoftAuth {
  private clientId = "00000000402b5328";
  private scope = "XboxLive.signin offline_access";

  async getDeviceCode(): Promise<any> {
    const res = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: this.clientId, scope: this.scope }),
    });
    return await res.json();
  }

  async pollDeviceCode(deviceCode: string): Promise<any> {
    const interval = 5000;
    while (true) {
      await new Promise((r) => setTimeout(r, interval));
      const tokenRes = await fetch(
        "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
            client_id: this.clientId,
            device_code: deviceCode,
          }),
        }
      );
      const data = await tokenRes.json();
      if (data.access_token) return data;
    }
  }

  async getMinecraftToken(accessToken: string): Promise<MinecraftSession> {
    const xblRes = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${accessToken}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      }),
    });
    const xbl = await xblRes.json();

    const xstsRes = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Properties: { SandboxId: "RETAIL", UserTokens: [xbl.Token] },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
      }),
    });
    const xsts = await xstsRes.json();

    const mcRes = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identityToken: `XBL3.0 x=${xbl.DisplayClaims.userHash};${xsts.Token}`,
      }),
    });
    const mcData = await mcRes.json();

    const profileRes = await fetch("https://api.minecraftservices.com/minecraft/profile", {
      headers: { Authorization: `Bearer ${mcData.access_token}` },
    });
    const profile = await profileRes.json();

    return {
      accessToken: mcData.access_token,
      uuid: profile.id,
      username: profile.name,
    };
  }
      }
