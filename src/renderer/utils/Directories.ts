import path from 'path';
import { Addon } from 'renderer/utils/InstallerConfiguration';
import fs from 'fs';
import settings, { msStoreBasePath, steamBasePath } from 'renderer/rendererSettings';
import { app } from '@electron/remote';

const TEMP_DIRECTORY_PREFIX = 'headwind-current-install';

const TEMP_DIRECTORY_PREFIXES_FOR_CLEANUP = ['headwind_current_install', TEMP_DIRECTORY_PREFIX];
export class Directories {
  private static sanitize(suffix: string): string {
    return path.normalize(suffix).replace(/^(\.\.(\/|\\|$))+/, '');
  }

  static appData(): string {
    return app.getPath('appData');
  }

  static localAppData(): string {
    return path.join(app.getPath('appData'), '..', 'Local');
  }

  static msfsBasePath(): string {
    return settings.get('mainSettings.msfsBasePath') as string;
  }

  static communityLocation(): string {
    return settings.get('mainSettings.msfsCommunityPath') as string;
  }

  static getInstalledPackagesPath(): Promise<string> {
    return new Promise((resolve, reject) => {
      let msfsBasePath = this.msfsBasePath();
      
      if(!fs.existsSync(msfsBasePath)) {
        reject(`msfsBasePath is not found: ${msfsBasePath}`);
        return;
      }      
      
      const msfsConfigPath = path.join(msfsBasePath, 'UserCfg.opt');
      fs.readFile(msfsConfigPath, 'utf8', (err, data) => {
        if (err) {
          reject("Error reading the file: " + err);
          return;
        }
        const regex = /InstalledPackagesPath\s+"([^"]+)"/;
        const match = data.match(regex);
        if (match && match[1]) {
          const pathValue = match[1];
          const steamPathFinal = path.join(pathValue, 'Official', 'Steam');
          const oneStorePathFinal = path.join(pathValue, 'Official', 'OneStore');

          if (fs.existsSync(steamPathFinal)) {
            resolve(steamPathFinal);
          }

          if (fs.existsSync(oneStorePathFinal)) {
            resolve(oneStorePathFinal);
          }
        }

        reject('InstalledPackagesPath not found.');
      });
    });
  }
  
  static inCommunityLocation(targetDir: string): string {
    return path.join(Directories.communityLocation(), this.sanitize(targetDir));
  }

  static inCommunityPackage(addon: Addon, targetDir: string): string {
    const baseDir = this.inCommunityLocation(this.sanitize(addon.targetDirectory));
    return path.join(baseDir, this.sanitize(targetDir));
  }

  static installLocation(): string {
    return settings.get('mainSettings.installPath') as string;
  }

  static inInstallLocation(targetDir: string): string {
    return path.join(Directories.installLocation(), this.sanitize(targetDir));
  }

  static inInstallPackage(addon: Addon, targetDir: string): string {
    const baseDir = this.inInstallLocation(this.sanitize(addon.targetDirectory));
    return path.join(baseDir, this.sanitize(targetDir));
  }

  static tempLocation(): string {
    return settings.get('mainSettings.separateTempLocation')
      ? (settings.get('mainSettings.tempLocation') as string)
      : (settings.get('mainSettings.installPath') as string);
  }

  static inTempLocation(targetDir: string): string {
    return path.join(Directories.tempLocation(), this.sanitize(targetDir));
  }

  static inPackages(targetDir: string): string {
    return path.join(this.msfsBasePath(), 'packages', this.sanitize(targetDir)).replace('LocalCache', 'LocalState');
  }

  static inPackageCache(addon: Addon, targetDir: string): string {
    const baseDir = this.inPackages(this.sanitize(addon.targetDirectory));

    return path.join(baseDir, this.sanitize(targetDir));
  }

  static temp(): string {
    const dir = path.join(Directories.tempLocation(), `${TEMP_DIRECTORY_PREFIX}-${(Math.random() * 1000).toFixed(0)}`);
    if (fs.existsSync(dir)) {
      return Directories.temp();
    }
    return dir;
  }

  static removeAllTemp(): void {
    console.log('[CLEANUP] Removing all temp directories');

    if (!fs.existsSync(Directories.tempLocation())) {
      console.warn('[CLEANUP] Location of temporary folders does not exist. Aborting');
      return;
    }

    try {
      const dirents = fs
        .readdirSync(Directories.tempLocation(), { withFileTypes: true })
        .filter((dirEnt) => dirEnt.isDirectory())
        .filter((dirEnt) => TEMP_DIRECTORY_PREFIXES_FOR_CLEANUP.some((it) => dirEnt.name.startsWith(it)));

      for (const dir of dirents) {
        const fullPath = Directories.inTempLocation(dir.name);

        console.log('[CLEANUP] Removing', fullPath);
        try {
          fs.rmSync(fullPath, { recursive: true });
          console.log('[CLEANUP] Removed', fullPath);
        } catch (e) {
          console.error('[CLEANUP] Could not remove', fullPath, e);
        }
      }

      console.log('[CLEANUP] Finished removing all temp directories');
    } catch (e) {
      console.error('[CLEANUP] Could not scan folder', Directories.tempLocation(), e);
    }
  }

  static removeAlternativesForAddon(addon: Addon): void {
    addon.alternativeNames?.forEach((altName) => {
      const altDir = Directories.inInstallLocation(altName);

      if (fs.existsSync(altDir)) {
        console.log('Removing alternative', altDir);
        fs.rmSync(altDir, { recursive: true });
      }
    });
  }

  static isFragmenterInstall(target: string | Addon): boolean {
    const targetDir = typeof target === 'string' ? target : Directories.inInstallLocation(target.targetDirectory);

    return fs.existsSync(path.join(targetDir, 'install.json'));
  }

  static isGitInstall(target: string | Addon): boolean {
    const targetDir = typeof target === 'string' ? target : Directories.inInstallLocation(target.targetDirectory);

    try {
      const symlinkPath = fs.readlinkSync(targetDir);
      if (symlinkPath && fs.existsSync(path.join(symlinkPath, '/../../../.git'))) {
        console.log('Is git repo', targetDir);
        return true;
      }
    } catch {
      console.log('Is not git repo', targetDir);
      return false;
    }
  }

  static inDocumentsFolder(targetDir: string): string {
    return path.join(app.getPath('documents'), this.sanitize(targetDir));
  }
}
