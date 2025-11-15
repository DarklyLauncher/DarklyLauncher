import fetch from 'node-fetch';

export interface VersionEntry {
  id: string;
  type: string;
  url: string;
  time: string;
  releaseTime: string;
}

export interface VersionManifest {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: VersionEntry[];
}

export class VersionManifestLoader {
  private manifestUrl = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
  private manifest: VersionManifest | null = null;

  async loadManifest(): Promise<VersionManifest> {
    if (this.manifest) return this.manifest;
    const res = await fetch(this.manifestUrl);
    const data: VersionManifest = await res.json();
    this.manifest = data;
    return data;
  }

  async getVersionEntry(id: string): Promise<VersionEntry | null> {
    const manifest = await this.loadManifest();
    const entry = manifest.versions.find(v => v.id === id) || null;
    return entry;
  }

  async getLatestRelease(): Promise<VersionEntry | null> {
    const manifest = await this.loadManifest();
    const latestId = manifest.latest.release;
    return manifest.versions.find(v => v.id === latestId) || null;
  }

  async getLatestSnapshot(): Promise<VersionEntry | null> {
    const manifest = await this.loadManifest();
    const latestId = manifest.latest.snapshot;
    return manifest.versions.find(v => v.id === latestId) || null;
  }
  }
