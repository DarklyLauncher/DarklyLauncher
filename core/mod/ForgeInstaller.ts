import fs from 'fs';
import path from 'path';
import { Downloader } from '../downloader/Downloader';
import { spawnSync } from 'child_process';

export class ForgeInstaller {
  downloader: Downloader;

  constructor() {
    this.downloader = new Downloader();
  }

  async install(versionDir: string, forgeVersion: string) {
    const url = `https://maven.minecraftforge.net/net/minecraftforge/forge/${forgeVersion}/forge-${forgeVersion}-installer.jar`;
    const target = path.join(versionDir, `forge-installer-${forgeVersion}.jar`);
    fs.mkdirSync(versionDir, { recursive: true });
    await this.downloader.download(url, target);

    spawnSync('java', ['-jar', target, '--installClient'], { stdio: 'inherit' });
  }
}
