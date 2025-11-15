import fs from 'fs';
import path from 'path';
import { Downloader } from '../downloader/Downloader';

export class FabricInstaller {
  downloader: Downloader;

  constructor() {
    this.downloader = new Downloader();
  }

  async install(versionDir: string, loaderVersion: string, minecraftVersion: string) {
    const url = `https://maven.fabricmc.net/net/fabricmc/fabric-installer/${loaderVersion}/fabric-installer-${loaderVersion}.jar`;
    const target = path.join(versionDir, `fabric-installer-${loaderVersion}.jar`);
    fs.mkdirSync(versionDir, { recursive: true });
    await this.downloader.download(url, target);

    const { spawnSync } = require('child_process');
    spawnSync('java', ['-jar', target, 'client', '-mcversion', minecraftVersion, '-loader', loaderVersion], { stdio: 'inherit' });
  }
}
