import fs from 'fs';
import https from 'https';
import path from 'path';

export class Downloader {
  download(url: string, output: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.mkdirSync(path.dirname(output), { recursive: true });
      const file = fs.createWriteStream(output, { flags: 'a' });
      const req = https.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) return reject(new Error(`HTTP ${res.statusCode}`));
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      });
      req.on('error', reject);
    });
  }
}
