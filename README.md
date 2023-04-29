![Headwind Simulations](https://headwindsim.net/assets/images/headwind-logo-light.png)

# Headwind Simulations Installer

This repository contains the installer for Headwind Simulations projects.

## How to contribute

The installer is built as an [Electron Application](https://www.electronjs.org/) for Windows using [TypeScript](https://www.typescriptlang.org/) and [React](https://reactjs.org/).

### Requirements

Please make sure you have:

- [git](https://git-scm.com/downloads)
- [NodeJS 16](https://nodejs.org/en/)

### Get started

First fork the project and install the dependencies

```shell script
npm install
```

Then run the development server using

```shell script
npm run dev
```

To build the package as .exe, run

```shell script
npm run package
```

Packaged applications will automatically update if there is a newer version available (compared to build version in package.json), this does also apply to development versions (ending on -devXX), which are updated via a separate stream. Updates are distributed once the build version is changed and a tag has been added.

## Credits
Based on the Open-Source [FlyByWire Simulations Installer](https://github.com/flybywiresim/installer).