import crypto from 'crypto';
import fs from 'fs';

export class HashUtils {
  static sha1(filePath: string): string {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha1').update(data).digest('hex');
  }

  static sha256(filePath: string): string {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
