import settings, {defaultCommunityDir, msStoreBasePath, steamBasePath} from "common/settings";
import { Directories } from "renderer/utils/Directories";
import { dialog } from "@electron/remote";
import fs from "fs-extra";

export const setupMsfsBasePath = async (): Promise<string> => {
    let basePath: string = "";
    const availablePaths: string[] = [];
    const availablePathIndex: string[] = [];
    if (fs.existsSync(msStoreBasePath)) {
        availablePaths.push('Microsoft Store Edition');
        availablePathIndex.push('MS Store');
    }
    if (fs.existsSync(steamBasePath)) {
        availablePaths.push('Steam Edition');
        availablePathIndex.push('Steam');
    }
    availablePaths.push('Custom Directory');
    availablePathIndex.push('Custom');
    dialog.showMessageBox({
        title: "Headwind Installer",
        message: 'We need to set the correct MSFS base path. Would you please help us? \n \n It is usually located somewhere here: \n "%LOCALAPPDATA%\\Packages\\Microsoft.FlightSimulator_8wekyb3d8bbwe\\LocalCache" \n \n or here: \n "%APPDATA%\\Microsoft Flight Simulator\\" \n\n and contains the UserOpt.cfg',
        type: 'warning',
        buttons: availablePaths,
    }).then((promise) => {
        const selection = availablePathIndex[promise.response];
        const setNewPath = (path: string) => {
            settings.set('mainSettings.msfsBasePath', path);
            settings.set('mainSettings.msfsCommunityPath', defaultCommunityDir(path));
            settings.set('mainSettings.installPath', defaultCommunityDir(path));
            dialog.showMessageBox({
                title: "Headwind Installer",
                message: 'We had to reset your community directory. If you are using a custom directory, you might want to change it again.',
                type: 'warning',
            });

            return path;
        };
        switch (selection) {
            case 'MS Store':
                basePath = setNewPath(msStoreBasePath);
                break;
            case 'Steam':
                basePath = setNewPath(steamBasePath);
                break;
            case 'Custom':
                dialog.showOpenDialog({
                    title: 'Select your MSFS Base directory',
                    properties: ['openDirectory'],
                }).then((path) => {
                    if (path.filePaths[0]) {
                        basePath = setNewPath(path.filePaths[0]);
                    }
                });
        }
    });

    return basePath;
};

export const setupMsfsCommunityPath = async (): Promise<string> => {
    const currentPath = Directories.installLocation();

    const path = await dialog.showOpenDialog({
        title: 'Select your MSFS community directory',
        defaultPath: typeof currentPath === 'string' ? currentPath : '',
        properties: ['openDirectory'],
    });

    if (path.filePaths[0]) {
        settings.set('mainSettings.msfsCommunityPath', path.filePaths[0]);
        return path.filePaths[0];
    } else {
        return "";
    }
};

export const setupInstallPath = async (): Promise<string> => {
    const currentPath = Directories.installLocation();

    const path = await dialog.showOpenDialog({
        title: 'Select your install directory',
        defaultPath: typeof currentPath === 'string' ? currentPath : '',
        properties: ['openDirectory'],
    });

    if (path.filePaths[0]) {
        settings.set('mainSettings.installPath', path.filePaths[0]);
        if (!settings.get('mainSettings.separateLiveriesPath')) {
            settings.set('mainSettings.liveriesPath', path.filePaths[0]);
        }
        return path.filePaths[0];
    } else {
        return "";
    }
};

export const setupTempLocation = async (): Promise<string> => {
    const currentPath = Directories.tempLocation();

    const path = await dialog.showOpenDialog({
        title: 'Select a location for temporary folders',
        defaultPath: typeof currentPath === 'string' ? currentPath : '',
        properties: ['openDirectory'],
    });

    if (path.filePaths[0]) {
        settings.set('mainSettings.tempLocation', path.filePaths[0]);
        return path.filePaths[0];
    } else {
        return "";
    }
};

export const setupLiveriesPath = async (): Promise<string> => {
    const currentPath = Directories.liveries();

    const path = await dialog.showOpenDialog({
        title: 'Select your liveries directory',
        defaultPath: typeof currentPath === 'string' ? currentPath : '',
        properties: ['openDirectory'],
    });

    if (path.filePaths[0]) {
        settings.set('mainSettings.liveriesPath', path.filePaths[0]);
        return path.filePaths[0];
    } else {
        return "";
    }
};
