import { Addon, ExternalApplicationDefinition, Publisher } from 'renderer/utils/InstallerConfiguration';
import { Resolver } from 'renderer/utils/Resolver';
import { store } from 'renderer/redux/store';
import { ApplicationStatus } from 'renderer/components/AddonSection/Enums';
import { ExternalApps } from 'renderer/utils/ExternalApps';
import path from 'path';
import { Directories } from 'renderer/utils/Directories';
import { shell } from '@electron/remote';
import { promises, constants as fsconstants  } from 'fs';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import {TypeOfSimulator} from "renderer/utils/SimManager";


export const STARTUP_FOLDER_PATH = 'Microsoft\\Windows\\Start Menu\\Programs\\Startup\\';

async function fileExists(file: any): Promise<boolean> {
  return await promises.access(file, fsconstants.F_OK)
    .then(() => true)
    .catch(() => false)
}

export class BackgroundServices {
  private static validateExecutablePath(path: string): boolean {
    return /^[a-zA-Z\d_-]+$/.test(path);
  }

  public static getExternalAppFromBackgroundService(addon: Addon, publisher: Publisher): ExternalApplicationDefinition {
    if (!addon.backgroundService) {
      throw new Error('Addon has no background service');
    }

    const appRef = addon.backgroundService.runCheckExternalAppRef;
    const app = Resolver.findDefinition(appRef, publisher);

    if (!app || app.kind !== 'externalApp') {
      throw new Error(
        `Attempted to find external app for background service, but runCheckExternalAppRef=${appRef} does not refer to a valid external app`,
      );
    }

    return app;
  }

  static isRunning(addon: Addon, publisher: Publisher): boolean {
    const app = this.getExternalAppFromBackgroundService(addon, publisher);

    const state = store.getState().applicationStatus[app.key];

    return state === ApplicationStatus.Open;
  }

  static async isAutoStartEnabled(addon: Addon): Promise<boolean> {
    const backgroundService = addon.backgroundService;

    if (!backgroundService) {
      throw new Error('Addon has no background service');
    }

    let folderEntries;
    try {
      folderEntries = await promises.readdir(path.join(Directories.appData(), STARTUP_FOLDER_PATH), {
        withFileTypes: true,
      });
    } catch (e) {
      console.error(
        '[BackgroundServices](isAutoStartEnabled) Could not read contents of startup folder. See exception below',
      );
      console.error(e);
    }

    if (!folderEntries) {
      return false;
    }

    const shortcuts = folderEntries.filter((it) => it.isFile() && path.extname(it.name) === '.lnk');
    const matchingShortcut = shortcuts.find(
      (it) => path.parse(it.name).name === backgroundService.executableFileBasename,
    );

    return matchingShortcut !== undefined;
  }

  static async setAutoStartEnabled(addon: Addon, publisher: Publisher, enabled: boolean): Promise<void> {
    const backgroundService = addon.backgroundService;

    if (!backgroundService) {
      throw new Error('Addon has no background service');
    }

    if (!this.validateExecutablePath(backgroundService.executableFileBasename)) {
      throw new Error('Executable path much match /^[a-zA-Z\\d_-]+$/.');
    }

    const exePath = path.join(
      Directories.inInstallLocation(addon.simulator, addon.targetDirectory),
      backgroundService.executableFileBasename,
    );
    const commandLineArgs = backgroundService.commandLineArgs ? ` ${backgroundService.commandLineArgs.join(' ')}` : '';

    const shortcutDir = path.join(Directories.appData(), STARTUP_FOLDER_PATH);
    const shortcutPath = path.join(shortcutDir, `${backgroundService.executableFileBasename}.lnk`);

    if (enabled) {
      const created = shell.writeShortcutLink(shortcutPath, 'create', {
        target: exePath,
        args: commandLineArgs,
        cwd: path.dirname(exePath),
      });

      if (!created) {
        console.error('[BackgroundServices](setAutoStartEnabled) Could not create shortcut');
      } else {
        console.log('[BackgroundServices](setAutoStartEnabled) Shortcut created');
      }
    } else {
      promises.rm(shortcutPath).catch((e) => {
        console.error('[BackgroundServices](setAutoStartEnabled) Could not remove shortcut. See exception below.');
        console.error(e);
      });
    }
  }

  static async start(addon: Addon): Promise<void> {
    const backgroundService = addon.backgroundService;

    if (!backgroundService) {
      throw new Error('Addon has no background service');
    }

    if (!this.validateExecutablePath(backgroundService.executableFileBasename)) {
      throw new Error('Executable path much match /^[a-zA-Z\\d_-]+$/.');
    }

    const exePath = path.normalize(
      path.join(
        Directories.inInstallLocation(addon.simulator, addon.targetDirectory),
        `${backgroundService.executableFileBasename}.exe`,
      ),
    );

    await shell.openPath(exePath);

    // if (exePath.startsWith('..')) {
    //     throw new Error('Validated and normalized path still traversed directory.');
    // }
    //
    // const commandLineArgs = backgroundService.commandLineArgs ?? [];
    //
    // spawn(exePath, commandLineArgs, { cwd: Directories.inCommunity(addon.targetDirectory), shell: true, detached: true });
  }
  
  static async installToSimStart(addon: Addon, install: boolean): Promise<void> {
    const backgroundService = addon.backgroundService;

    if (!backgroundService) {
      throw new Error('Addon has no background service');
    }

    if (!this.validateExecutablePath(backgroundService.executableFileBasename)) {
      throw new Error('Executable path much match /^[a-zA-Z\\d_-]+$/.');
    }
    const executablePath = path.normalize(
      path.join(
        Directories.inInstallLocation(addon.simulator, addon.targetDirectory),
        `${backgroundService.executableFileBasename}.exe`,
      ),
    );

    const basePath = Directories.simulatorBasePath(addon.simulator);    
    const exePath = path.join(basePath, 'exe.xml');
    let base;
    if (await fileExists(exePath)) {
      const content = await promises.readFile(exePath, 'utf-8');
      const parser = new XMLParser({ ignoreAttributes: false, unpairedTags: ['?xml'] });
      base = parser.parse(content);
    } else {
      if (!install) {
        return;
      }
      base = {
        '?xml': { '@_version': '1.0', '@_encoding': 'utf-8' },
        'SimBase.Document': {
          Descr: 'Launch',
          Filename: 'EXE.xml',
          Disabled: 'False',
          'Launch.ManualLoad': 'False',
          'Launch.Addon': [],
          '@_Type': 'Launch',
          '@_version': '1,0',
        },
      };
    }

    if (!base['SimBase.Document'])
      base['SimBase.Document'] = {
        Descr: 'Launch',
        Filename: 'EXE.xml',
        Disabled: 'False',
        'Launch.ManualLoad': 'False',
        'Launch.Addon': [],
        '@_Type': 'Launch',
        '@_version': '1,0',
      };
    if (!base['SimBase.Document']['Launch.Addon']) base['SimBase.Document']['Launch.Addon'] = [];

    if (base['SimBase.Document']['Launch.Addon'] && !Array.isArray(base['SimBase.Document']['Launch.Addon']))
      base['SimBase.Document']['Launch.Addon'] = [base['SimBase.Document']['Launch.Addon']];

    base['SimBase.Document']['Launch.Addon'] = base['SimBase.Document']['Launch.Addon'].filter(
      (e: any) => e.Name !== addon.key,
    );
    if (install) {
      base['SimBase.Document']['Launch.Addon'].push({
        Disabled: 'False',
        ManualLoad: 'False',
        Name: addon.key,
        Path: executablePath,
      });
    }
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
    });
    const xmlOutput = builder.build(base);
    await promises.writeFile(exePath, xmlOutput);
  }
  
  static async kill(addon: Addon, publisher: Publisher): Promise<void> {
    const app = this.getExternalAppFromBackgroundService(addon, publisher);

    return ExternalApps.kill(app);
  }
}
