import fs from 'fs';
import path from 'path';
import { Downloader } from '../downloader/Downloader';
import { spawnSync } from 'child_process';

export class QuiltInstaller {
  downloader: Downloader;

  constructor() {
    this.downloader = new Downloader();
  }

  async install(versionDir: string, loaderVersion: string, minecraftVersion: string) {
    const url = `https://maven.quiltmc.org/repository/release/org/quiltmc/quilt-installer/${loaderVersion}/quilt-installer-${loaderVersion}.jar`;
    const target = path.join(versionDir, `quilt-installer-${loaderVersion}.jar`);
    fs.mkdirSync(versionDir, { recursive: true });
    await this.downloader.download(url, target);

    spawnSync('java', ['-jar', target, 'client', '-mcversion', minecraftVersion, '-loader', loaderVersion], { stdio: 'inherit' });
  }
}
