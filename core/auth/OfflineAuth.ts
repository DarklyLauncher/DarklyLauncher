import crypto from 'crypto';

export interface OfflineSession {
  username: string;
  uuid: string;
  accessToken: string;
}

export class OfflineAuth {
  generateSession(username: string): OfflineSession {
    const uuid = crypto.randomUUID();
    return { username, uuid, accessToken: "OFFLINE" };
  }
}
