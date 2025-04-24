import {
  Addon,
  Configuration,
  Definition,
  ExternalApplicationDefinition,
  Publisher,
} from 'renderer/utils/InstallerConfiguration';
import { store } from 'renderer/redux/store';
import {Directories} from "renderer/utils/Directories";
import fs from 'fs';
import path from 'path';

const _cache: { [k: string]: Definition } = {};

export class Resolver {
  private static getConfiguration(): Configuration {
    return store.getState().configuration;
  }

  public static findPublisher(key: string): Publisher | undefined {
    const config = this.getConfiguration();

    return config.publishers.find((it) => it.key === key);
  }

  public static findAddon(publisherKey: string, addonKey: string): Addon | undefined {
    const publisher = this.findPublisher(publisherKey);

    if (!publisher) {
      return undefined;
    }

    return publisher.addons.find((it) => it.key === addonKey);
  }
  
  public static async findExternalAddon(publisherKey: string, addonKey: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      console.log('Searching for external addon');

      console.log('Searching in Community Directory...');
      const comDir = Directories.communityLocation();
      if (fs.existsSync(comDir)) {
        console.log(`CommunityInstalledPackagesPath: ${comDir}`);
        const isFound = this.findInInstallPath(comDir, publisherKey, addonKey);
        if (isFound) {
          console.log('Found in Community Directory');
          return resolve(true);
        }
      }

      await Directories.getInstalledPackagesPath().then((installedPackagesPath) => {
        console.log(`InstalledPackagesPath: ${installedPackagesPath}`);
        console.log('Searching in Offical Packages Directory...');

        const isFound = this.findInInstallPath(installedPackagesPath, publisherKey, addonKey);
        if (isFound) {
          console.log('Found in Official Packages Directory');
          return resolve(true);
        }

        console.log('Not found');
        return resolve(false);
      }).catch((err) => {
        console.error(err);
        return resolve(false);
      });
    });
    

    
       
    /*
    const installedPackagesPath= await Directories.getInstalledPackagesPath()  
    console.log(`InstalledPackagesPath: ${installedPackagesPath}`);
    console.log('Searching in Offical Packages Directory...');

    const isFound = this.findInInstallPath(installedPackagesPath, publisherKey, addonKey);
    if(isFound) {
      console.log('Found in Official Packages Directory');
      return true;
    }

    console.log('Not found');
    return false;
    */
  }

  private static findInInstallPath(installPath: string, creator?: string, title?: string) {
    const manifestFileName = 'manifest.json';
    const addonFolders = fs.readdirSync(installPath);
    for (const entry of addonFolders) {
      const filePath = path.join(installPath, entry);
      if(fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          const dirEntries = fs.readdirSync(filePath);

          if (dirEntries.includes(manifestFileName)) {
            try {
              const manifest = JSON.parse(fs.readFileSync(path.join(filePath, manifestFileName), 'utf8'));

              const titleMatches = !title || manifest.title.toLowerCase() === title.toLowerCase();
              const creatorMatches = !creator || manifest.creator.toLowerCase() === creator.toLowerCase();
              
              if (titleMatches && creatorMatches) {
                return true;
              }              
            } catch (e) {
              console.warn(`Failed to read or parse manifest.json in ${filePath}:`, e.message);
            }
          }
        }
      }
    }

    return false;
  }

  public static findDefinition(ref: string, publisher: Publisher): Definition {
    if (_cache[ref]) {
      return _cache[ref];
    }

    const isOwnPublisher = ref[1] === '/';

    if (isOwnPublisher) {
      const defKey = ref.substring(2);

      const found = publisher.defs.find((it) => it.key === defKey);

      _cache[ref] = found;

      return found;
    } else {
      const parsedRef = /@(\w+)\/(\w+)/;

      if (!parsedRef) {
        throw new Error(`Could not parse reference=${ref}`);
      }

      const [, publisherKey, defKey] = parsedRef[Symbol.match](ref);

      const publisher = this.findPublisher(publisherKey);

      if (!publisher) {
        throw new Error(`Cannot find publisher with key=${publisherKey}`);
      }

      const found = publisher.defs.find((it) => it.key === defKey);

      if (!found) {
        throw new Error(`Cannot find definition with key=${defKey} for publisher=${publisher.key}`);
      }

      _cache[ref] = found;

      return found;
    }
  }

  public static getExternalApps(publisherKey: string): ExternalApplicationDefinition[] {
    const publisher = this.findPublisher(publisherKey);

    if (!publisher) {
      throw new Error(`Cannot find publisher with key=${publisherKey}`);
    }

    return publisher.defs.filter((it) => it.kind === 'externalApp') as ExternalApplicationDefinition[];
  }
}
