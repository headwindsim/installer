import path from "path";
import walk from "walkdir";
import { Addon } from "renderer/utils/InstallerConfiguration";
import fs from "fs-extra";
import settings from "common/settings";

const TEMP_DIRECTORY_PREFIX = 'headwind-current-install';

const TEMP_DIRECTORY_PREFIXES_FOR_CLEANUP = [
    'headwind_current_install',
    TEMP_DIRECTORY_PREFIX,
];

export class Directories {
    private static sanitize(suffix: string): string {
        return path.normalize(suffix).replace(/^(\.\.(\/|\\|$))+/, '');
    }

    static communityLocation(): string {
        return settings.get('mainSettings.msfsCommunityPath') as string;
    }

    static baseLocation(): string {
        return settings.get('mainSettings.msfsBasePath') as string;
    }

    static officialLocation = (): string => {
        const msfsConfigPath = path.join(Directories.baseLocation(), 'UserCfg.opt');
        if (!fs.existsSync(msfsConfigPath)) {
            return 'C:\\';
        }

        try {
            const msfsConfig = fs.readFileSync(msfsConfigPath).toString();
            const msfsConfigLines = msfsConfig.split(/\r?\n/);
            const packagesPathLine = msfsConfigLines.find(line => line.includes('InstalledPackagesPath'));
            const officialDir = path.join(packagesPathLine.split(" ").slice(1).join(" ").replaceAll('"', ''), "\\Official");

            return fs.existsSync(officialDir) ? officialDir : 'C:\\';
        } catch (e) {
            console.warn('Could not parse official dir from file', msfsConfigPath);
            console.error(e);
            return 'C:\\';
        }
    };

    static getOfficialLocation(): Promise<string> {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(Directories.inOfficialLocation('Steam'))) {
                resolve(path.join(Directories.officialLocation(), 'Steam'));
            }

            if(fs.existsSync(Directories.inOfficialLocation('OneStore'))) {
                resolve(path.join(Directories.officialLocation(), 'OneStore'));
            }

            reject('OfficialLocationPath not found.');
        });
    }

    static inOfficialLocation(targetDir: string): string {
        console.log(path.join(Directories.officialLocation(), this.sanitize(targetDir)));
        return path.join(Directories.officialLocation(), this.sanitize(targetDir));
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
        return settings.get('mainSettings.separateTempLocation') ? settings.get('mainSettings.tempLocation') as string : settings.get('mainSettings.installPath') as string;
    }

    static inTempLocation(targetDir: string): string {
        return path.join(Directories.tempLocation(), this.sanitize(targetDir));
    }

    static liveries(): string {
        return settings.get('mainSettings.liveriesPath') as string;
    }

    static inLiveries(targetDir: string): string {
        return path.join(settings.get('mainSettings.liveriesPath') as string, this.sanitize(targetDir));
    }

    static inPackages(targetDir: string): string {
        return path.join(settings.get('mainSettings.msfsBasePath') as string, 'packages', this.sanitize(targetDir)).replace('LocalCache', 'LocalState')
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
            const dirents = fs.readdirSync(Directories.tempLocation(), { withFileTypes: true })
                .filter(dirEnt => dirEnt.isDirectory())
                .filter(dirEnt => TEMP_DIRECTORY_PREFIXES_FOR_CLEANUP.some((it) => dirEnt.name.startsWith(it)));

            for (const dir of dirents) {
                const fullPath = Directories.inTempLocation(dir.name);

                console.log('[CLEANUP] Removing', fullPath);
                try {
                    fs.removeSync(fullPath);
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
        addon.alternativeNames?.forEach(altName => {
            const altDir = Directories.inInstallLocation(altName);

            if (fs.existsSync(altDir)) {
                console.log('Removing alternative', altDir);
                fs.removeSync(altDir);
            }
        });
    }

    static removeTargetForAddon(addon: Addon): void {
        const dir = Directories.inInstallLocation(addon.targetDirectory);

        if (fs.existsSync(dir)) {
            console.log('Removing', dir);
            fs.removeSync(dir);
        }
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
}
