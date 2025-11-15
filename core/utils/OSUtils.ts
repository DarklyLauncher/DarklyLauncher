import os from 'os';
import path from 'path';

export class OSUtils {
  static getPlatform(): string {
    const plat = os.platform();
    if (plat === 'win32') return 'windows';
    if (plat === 'darwin') return 'mac';
    if (plat === 'linux') return 'linux';
    return 'unknown';
  }

  static getUserHome(): string {
    return os.homedir();
  }

  static getDefaultMinecraftDir(): string {
    const home = this.getUserHome();
    const plat = this.getPlatform();
    if (plat === 'windows') return path.join(home, 'AppData', 'Roaming', '.minecraft');
    if (plat === 'mac') return path.join(home, 'Library', 'Application Support', 'minecraft');
    if (plat === 'linux') return path.join(home, '.minecraft');
    return path.join(home, '.minecraft');
  }
}
