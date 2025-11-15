import path from 'path';
import fs from 'fs';
import { Downloader } from './Downloader';

export class AssetDownloader {
  downloader: Downloader;

  constructor() {
    this.downloader = new Downloader();
  }

  async downloadAsset(hash: string, key: string, baseDir: string) {
    const url = `https://resources.download.minecraft.net/${hash.substring(0, 2)}/${hash}`;
    const target = path.join(baseDir, key);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    await this.downloader.download(url, target);
  }

  async downloadAssetsFromIndex(indexData: any, baseDir: string) {
    const objects = indexData.objects || {};
    for (const key in objects) {
      const hash = objects[key].hash;
      await this.downloadAsset(hash, key, baseDir);
    }
  }
      }
