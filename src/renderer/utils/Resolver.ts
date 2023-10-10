import {
    Addon,
    Configuration,
    Definition,
    ExternalApplicationDefinition,
    Publisher,
} from "renderer/utils/InstallerConfiguration";
import { store } from "renderer/redux/store";
import {Directories} from "renderer/utils/Directories";
import fs from "fs-extra";
import path from "path";

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

    public static async findExternalAddon(creator?: string, title?: string): Promise<boolean> {
        const isFound = false;
        console.log('Searching for external addon');
        
        const steam= await Directories.getInstalledPackagesSteamPath();
        if(fs.existsSync(steam)) {
            console.log(`SteamInstalledPackagesPath: ${steam}`);
        }

        const onestore= await Directories.getInstalledPackagesOneStorePath();
        if(fs.existsSync(onestore)) {
            console.log(`OneStoreInstalledPackagesPath: ${onestore}`);
        }        
        
        const manifestFileName = 'manifest.json';
        const comDir = Directories.communityLocation();

        const addonFolders = fs.readdirSync(comDir);

        for (const entry of addonFolders) {
            const filePath = path.join(comDir, entry);
            if(fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    const dirEntries = fs.readdirSync(filePath);

                    if (dirEntries.includes(manifestFileName)) {
                        const manifest = JSON.parse(fs.readFileSync(path.join(filePath, manifestFileName), 'utf8'));

                        const titleMatches = !title || manifest.title.toLowerCase() === title.toLowerCase();
                        const creatorMatches = !creator || manifest.creator.toLowerCase() === creator.toLowerCase();

                        if (titleMatches && creatorMatches) {
                            return true;
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
