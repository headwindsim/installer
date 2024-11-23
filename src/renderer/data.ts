import { Configuration } from './utils/InstallerConfiguration';

export const defaultConfiguration: Configuration = {
  version: 1,
  publishers: [
    {
      name: 'Headwind Simulations',
      key: 'headwindsim',
      logoUrl: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/Headwind.svg',
      defs: [
        {
          kind: 'addonCategory',
          key: 'aircraft',
          title: 'Aircraft',
        },
        {
          kind: 'addonCategory',
          key: 'airbus',
          title: 'Airbus',
        },
        {
          kind: 'addonCategory',
          key: 'sukhoi',
          title: 'Sukhoi',
        },
        {
          kind: 'addonCategory',
          key: 'scenery',
          title: 'Scenery',
        },
        {
          kind: 'addonCategory',
          key: 'livery',
          title: 'Livery',
        },
        {
          kind: 'addonCategory',
          key: 'other',
          title: 'Other',
        },
        {
          kind: 'addonCategory',
          key: 'simbridge',
          styles: ['align-bottom'],
        },
        {
          kind: 'externalApp',
          key: 'mcdu-server',
          prettyName: 'MCDU Server',
          detectionType: 'ws',
          url: 'ws://localhost:8380',
        },
        {
          kind: 'externalApp',
          key: 'simbridge-app',
          prettyName: 'SimBridge',
          detectionType: 'http',
          url: 'http://localhost:8380/health',
          killUrl: 'http://localhost:8380/health/kill',
          killMethod: 'GET',
        },
        {
          kind: 'externalApp',
          key: 'msfs',
          prettyName: 'MSFS',
          detectionType: 'tcp',
          port: 500,
        },
      ],
      addons: [
        {
          name: 'A339X',
          key: 'a339x',
          repoOwner: 'headwindsim',
          repoName: 'aircraft',
          category: '@airbus',
          aircraftName: 'A330-900neo Series',
          titleImageUrl: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/A339X-Dark.svg',
          titleImageUrlSelected: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/A339X-Light.svg',
          enabled: true,
          backgroundImageUrls: ['https://raw.githubusercontent.com/headwindsim/branding/main/images/A339X/installer_bg_3.png'],
          shortDescription: 'Airbus A330-900 Series',
          description: 'The Airbus A330neo is a wide-body airliner developed by Airbus from the Airbus A330. The A330neo has 260 and 300 seats in a typical three-class layout, or up to 460 in economy class and has a range of 7,200 nautical miles. It is exclusively powered by the Rolls-Royce Trent 7000.',
          techSpecs: [
            {
              name: 'Engines',
              value: 'Rolls-Royce Trent 7000',
            },
            {
              name: 'APU',
              value: 'APS3200',
            },
          ],
          targetDirectory: 'headwindsim-aircraft-a330-900',
          alternativeNames: [
            'headwind-aircraft-a330-900',
            'A339X',
            'a339x',
          ],
          tracks: [
            {
              name: 'Release',
              key: 'a339x-stable',
              url: 'https://cdn.headwindsim.net/addons/a339x/release',
              alternativeUrls: [
                'external/a339x/stable',
              ],
              description: 'Stable is our variant that has the least bugs and best performance. ' +
                'This version will not always be up to date but we guarantee its compatibility ' +
                'with each major patch from MSFS.' +
                '\n\n**SimBrief Airframes for Stable**'+
                '\n\nAirframe for: [A330-900](https://dispatch.simbrief.com/airframes/share/352855_1683790837790)'+
                '\n\nAirframe for: [ACJ330-900](https://dispatch.simbrief.com/airframes/share/352855_1683790837791)',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              },
            },
            {
              name: 'Pre-Release',
              key: 'a339x-prerelease',
              url: 'https://cdn.headwindsim.net/addons/a339x/staging',
              description: 'This is a pre-release version of our Addon used for public testing before the official launch. ' +
                'You can choose between the stable build, which is the final version, or the prerelease build, which may have some bugs ' +
                'or incomplete features but is useful for testing and providing feedback to our developers.' +
                '\n\n**SimBrief Airframes for Pre-Release**'+
                '\n\nAirframe for: [A330-900](https://dispatch.simbrief.com/airframes/share/352855_1683790837790)'+
                '\n\nAirframe for: [ACJ330-900](https://dispatch.simbrief.com/airframes/share/352855_1683790837791)',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              },
            }
          ],
          dependencies: [
            {
              addon: '@headwindsim/simbridge',
              optional: true,
              modalText: 'SimBridge allows the A339X to expose remote tools like the Web MCDU, as well as use the external terrain database.',
            },
          ],
          myInstallPage: {
            links: [
              {
                url: 'https://docs.flybywiresim.com/fbw-a32nx/',
                title: 'Documentation',
              },
              {
                url: 'https://flightsim.to/add-ons/airbus-a330-900',
                title: 'Add-Ons',
              },
            ],
            directories: [
              {
                location: {
                  in: 'packageCache',
                  path: 'work',
                },
                title: 'Work Folder',
              },
            ],
          },
          disallowedRunningExternalApps: ['@/msfs', '@/mcdu-server'],
        },
        {
          name: 'SU95X',
          key: 'su95x',
          repoOwner: 'headwindsim',
          repoName: 'aircraft',
          category: '@sukhoi',
          aircraftName: 'Superjet 100 Series',
          titleImageUrl: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/SU95X-Dark.svg',
          titleImageUrlSelected: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/SU95X-Light.svg',
          enabled: true,
          backgroundImageUrls: ['https://raw.githubusercontent.com/headwindsim/branding/main/images/SU95X/installer_bg.png'],
          shortDescription: 'Sukhoi Superjet 100 Series',
          description: 'Sukhoi Superjet 100 is a regional jet designed by Sukhoi Civil Aircraft. It replaces Tupolev Tu-134 and Yakovlev Yak-42, as well as competes with Embraer E190 and Bombardier CRJ1000. It is the first Russian airliners designed after the fall of the Soviet Union. It uses PowerJet (Joint Venture between Safran and Russias NPO Saturn) SaM 146 to power the aircraft. While it receives some international orders, SSJ100 has trouble gaining popularity outside Russia due to spare parts issues.',
          techSpecs: [
            {
              name: 'Engines',
              value: 'SaM146-1S18',
            },
            {
              name: 'APU',
              value: 'RE-220(RJ)',
            },
          ],
          targetDirectory: 'headwindsim-aircraft-su100-95',
          alternativeNames: [
            'headwind-aircraft-su100-95',
            'SU95X',
            'su95x',
          ],
          tracks: [
            {
              name: 'Release',
              key: 'su95x-stable',
              url: 'https://cdn.headwindsim.net/addons/su95x/release',
              alternativeUrls: [
                'external/su95x/stable',
              ],
              description: 'Stable is our variant that is based on the FlyByWire A32NX stable version and has the fewest issues and best performance. This version won\'t always up-to-date, but we promise that it will work with all of MSFS\'s significant updates.',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              },
            },
            {
              name: 'Pre-Release',
              key: 'su95x-prerelease',
              url: 'https://cdn.headwindsim.net/addons/su95x/staging',
              description: 'This is a pre-release version of our Addon used for public testing before the official launch. ' +
                'You can choose between the stable build, which is the final version, or the prerelease build, which may have some bugs ' +
                'or incomplete features but is useful for testing and providing feedback to our developers.',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              },
            },

          ],
          dependencies: [
            {
              addon: '@headwindsim/simbridge',
              optional: true,
              modalText: 'SimBridge allows the SU95X to expose remote tools like the Web MCDU, as well as use the external terrain database.',
            },
          ],
          myInstallPage: {
            links: [
              {
                url: 'https://docs.flybywiresim.com/fbw-a32nx/',
                title: 'Documentation',
              },
              {
                url: 'https://flightsim.to/add-ons/sukhoi-superjet-100/',
                title: 'Add-Ons',
              },
            ],
            directories: [
              {
                location: {
                  in: 'packageCache',
                  path: 'work',
                },
                title: 'Work Folder',
              },
            ],
          },
          disallowedRunningExternalApps: ['@/msfs', '@/mcdu-server'],
        },
        {
          key: 'a339x-livery',
          name: 'A339X Livery Package',
          repoOwner: 'headwindsim',
          repoName: 'aircraft',
          category: '@livery',
          aircraftName: 'A339X',
          titleImageUrl: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/Livery-Package-Dark.svg',
          titleImageUrlSelected: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/Livery-Package-Light.svg',
          enabled: true,
          backgroundImageUrls: ['https://raw.githubusercontent.com/headwindsim/branding/main/images/A339X/livery_package_1.png'],
          shortDescription: 'A339X Livery Package',
          description: 'This package includes liveries for AirBelgium, Condor (Beach, Island, and Sea variants), Corsair, Delta, Hifly, and TAP (Air Portugal and STAR Alliance variants), all carefully designed to match the real-life paint schemes of these airlines. Whether you\'re looking to simulate a transatlantic flight with Delta, a tropical getaway with Corsair, or a business trip with TAP, our liveries will help you fully immerse in your simulation experience.',
          targetDirectory: 'headwindsim-a339x-livery-package',
          alternativeNames: [],
          tracks: [
            {
              name: 'Release',
              key: 'a339x-livery-release',
              url: 'https://cdn.headwindsim.net/addons/a339x-livery-package/release',
              description: 'This package includes liveries for AirBelgium, Condor (Beach, Island, and Sea variants), Corsair, Delta, Hifly, and TAP (Air Portugal and STAR Alliance variants), all carefully designed to match the real-life paint schemes of these airlines. Whether you\'re looking to simulate a transatlantic flight with Delta, a tropical getaway with Corsair, or a business trip with TAP, our liveries will help you fully immerse in your simulation experience.',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              }
            }
          ],
          dependencies: [
            {
              addon: '@headwindsim/a339x',
              optional: false,
              modalText: 'Will need base package to be working.',
            },
          ],
          incompatibleAddons: [],
          myInstallPage: {
            links: [
              {
                url: 'https://flightsim.to/add-ons/airbus-a330-900',
                title: 'Add-Ons',
              }
            ],
            directories: [
              {
                location: {
                  in: 'package',
                  path: 'resources',
                },
                title: 'Resources',
              },
            ],
          },
          disallowedRunningExternalApps: ['@/msfs'],
        },
        {
          key: 'su95x-livery',
          name: 'SU95X Livery Package',
          repoOwner: 'headwindsim',
          repoName: 'aircraft',
          category: '@livery',
          aircraftName: 'SU95X',
          titleImageUrl: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/Livery-Package-Dark.svg',
          titleImageUrlSelected: 'https://raw.githubusercontent.com/headwindsim/branding/main/logos/Livery-Package-Light.svg',
          enabled: true,
          backgroundImageUrls: ['https://raw.githubusercontent.com/headwindsim/branding/main/images/SU95X/livery_package.png'],
          shortDescription: 'SU95X Livery Package',
          description: 'This package includes liveries for Aeroflot, Armavia, Azimuth, Interjet, RedWings and Yakutia, all carefully designed to match the real-life paint schemes of these airlines.',
          targetDirectory: 'headwindsim-su95x-livery-package',
          alternativeNames: [],
          tracks: [
            {
              name: 'Release',
              key: 'su95x-livery-release',
              url: 'https://cdn.headwindsim.net/addons/su95x-livery-package/release',
              description: 'This package includes liveries for Aeroflot, Armavia, Azimuth, Interjet, RedWings and Yakutia, all carefully designed to match the real-life paint schemes of these airlines.',
              isExperimental: false,
              releaseModel: {
                type: 'fragmenter',
              },
            }
          ],
          dependencies: [
            {
              addon: '@headwindsim/su95x',
              optional: false,
              modalText: 'Will need base package to be working.',
            },
          ],
          incompatibleAddons: [],
          myInstallPage: {
            links: [
              {
                url: 'https://flightsim.to/add-ons/sukhoi-superjet-100/',
                title: 'Add-Ons',
              }
            ],
            directories: [
              {
                location: {
                  in: 'package',
                  path: 'resources',
                },
                title: 'Resources',
              },
            ],
          },
          disallowedRunningExternalApps: ['@/msfs'],
        },
        {
          name: 'SimBridge',
          key: 'simbridge',
          category: '@simbridge',
          repoOwner: 'flybywiresim',
          repoName: 'simbridge',
          aircraftName: 'FBW SimBridge',
          titleImageUrl: 'https://flybywiresim.b-cdn.net/installer/media-assets/addon-titles/fbw-simbridge/dark.svg',
          titleImageUrlSelected: 'https://flybywiresim.b-cdn.net/installer/media-assets/addon-titles/fbw-simbridge/light.svg',
          enabled: true,
          backgroundImageUrls: ['https://flybywiresim.b-cdn.net/installer/media-assets/addon-headers/fbw-simbridge/0.png'],
          backgroundImageShadow: false,
          shortDescription: 'Airbus A380-800',
          description: 'SimBridge is an external application which allows FBW aircraft to communicate with components located outside the simulator. SimBridge will be used for a number of features requiring external data (such as TAWS terrain display), as well as for functionality providing remote access to aircraft systems or data.',
          targetDirectory: 'flybywire-externaltools-simbridge',
          tracks: [
            {
              name: 'Release',
              key: 'release',
              releaseModel: {
                type: 'githubRelease',
              },
              url: 'https://cdn.flybywiresim.com/addons/simbridge/release/',
              isExperimental: false,
              description: 'SimBridge is an external app that enables FlyByWire Simulations aircraft to communicate outside your simulator. From remote displays to external terrain display rendering, it is used for a variety of optional features.',
            },
          ],
          disallowedRunningExternalApps: ['@/simbridge-app'],
          backgroundService: {
            executableFileBasename: 'fbw-simbridge',
            runCheckExternalAppRef: '@/simbridge-app',
            commandLineArgs: ['--hide'],
          },
          myInstallPage: {
            links: [
              {
                url: 'https://docs.flybywiresim.com/simbridge/',
                title: 'Documentation',
              },
            ],
            directories: [
              {
                location: {
                  in: 'package',
                  path: 'resources',
                },
                title: 'Resources',
              },
            ],
          },
        },
      ],
      buttons: [
        {
          text: 'Documentation',
          action: 'openBrowser',
          url: 'https://docs.flybywiresim.com/',
        },
        {
          text: 'Website',
          action: 'openBrowser',
          url: 'https://headwindsim.net/',
        },
        {
          text: 'Discord',
          action: 'openBrowser',
          url: 'https://discord.headwindsim.net/',
          inline: true,
        },
        {
          text: 'Support Us!',
          action: 'openBrowser',
          url: 'https://www.patreon.com/headwindsim',
        },
      ],
    }
  ],
};
