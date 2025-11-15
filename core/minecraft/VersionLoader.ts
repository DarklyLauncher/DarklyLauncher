import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { Downloader } from '../downloader/Downloader';

export interface VersionJSON {
  id: string;
  mainClass: string;
  arguments?: any;
  libraries: { name: string; downloads: any }[];
  assets: string;
}

export class VersionLoader {
  versionsDir: string;
  downloader: Downloader;

  constructor() {
    this.versionsDir = path.join(process.cwd(), 'versions');
    this.downloader = new Downloader();
  }

  async getVersionManifest(): Promise<any> {
    const url = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
    const res = await fetch(url);
    return await res.json();
  }

  async downloadVersion(id: string): Promise<VersionJSON> {
    const manifest = await this.getVersionManifest();
    const entry = manifest.versions.find((v: any) => v.id === id);
    const versionData = await (await fetch(entry.url)).json();

    const folder = path.join(this.versionsDir, id);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, `${id}.json`), JSON.stringify(versionData, null, 2));

    await this.downloadLibraries(versionData.libraries, folder);
    await this.downloadAssets(versionData.assets, folder);

    return versionData as VersionJSON;
  }

  async downloadLibraries(libraries: any[], folder: string) {
    for (const lib of libraries) {
      if (!lib.downloads || !lib.downloads.artifact) continue;
      const url = lib.downloads.artifact.url;
      const target = path.join(folder, 'libraries', lib.downloads.artifact.path || lib.name.replace(/\./g, '/') + '.jar');
      fs.mkdirSync(path.dirname(target), { recursive: true });
      await this.downloader.download(url, target);
    }
  }

  async downloadAssets(assetIndex: string, folder: string) {
    const assetsDir = path.join(folder, 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });

    const indexUrl = `https://launchermeta.mojang.com/v1/packages/${assetIndex}`;
    const indexRes = await fetch(indexUrl);
    const indexData = await indexRes.json();

    for (const key in indexData.objects) {
      const hash = indexData.objects[key].hash;
      const url = `https://resources.download.minecraft.net/${hash.substring(0, 2)}/${hash}`;
      const target = path.join(assetsDir, key);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      await this.downloader.download(url, target);
    }
  }
  }
