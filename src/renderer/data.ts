import { Configuration } from "./utils/InstallerConfiguration";

export const defaultConfiguration: Configuration = {
    version: 1,
    "publishers": [
        {
            "name": "Headwind Simulations",
            "key": "headwind",
            "logoUrl": "https://raw.githubusercontent.com/headwindsim/branding/main/logos/Headwind.svg",
            "defs": [
                {
                    "kind": "addonCategory",
                    "key": "aircraft",
                    "title": "Aircraft"
                },
                {
                    "kind": "addonCategory",
                    "key": "simbridge",
                    "styles": [
                        "align-bottom"
                    ]
                },
                {
                    "kind": "externalApp",
                    "key": "mcdu-server",
                    "prettyName": "MCDU Server",
                    "detectionType": "ws",
                    "url": "ws://localhost:8380"
                },
                {
                    "kind": "externalApp",
                    "key": "simbridge-app",
                    "prettyName": "SimBridge",
                    "detectionType": "http",
                    "url": "http://localhost:8380/health",
                    "killUrl": "http://localhost:8380/health/kill",
                    "killMethod": "GET"
                },
                {
                    "kind": "externalApp",
                    "key": "msfs",
                    "prettyName": "MSFS",
                    "detectionType": "tcp",
                    "port": 500
                }
            ],
            "addons": [
                {
                    "key": "A339X",
                    "name": "A339X",
                    "repoOwner": "headwindsim",
                    "repoName": "a339x",
                    "category": "@aircraft",
                    "aircraftName": "A330-941",
                    "titleImageUrl": "https://raw.githubusercontent.com/headwindsim/branding/main/logos/A339X-Dark.svg",
                    "titleImageUrlSelected": "https://raw.githubusercontent.com/headwindsim/branding/main/logos/A339X-Light.svg",
                    "enabled": true,
                    "backgroundImageUrls": [
                        "https://raw.githubusercontent.com/headwindsim/branding/main/images/installer_bg.png"
                    ],
                    "shortDescription": "Airbus 330-900",
                    "description": "The Airbus A330neo is a wide-body airliner developed by Airbus from the Airbus A330. The A330neo has 260 and 300 seats in a typical three-class layout, or up to 460 in economy class and has a range of 7,200 nautical miles. It is exclusively powered by the Rolls-Royce Trent 7000.",
                    "techSpecs": [
                        {
                            "name": "Engines",
                            "value": "Rolls-Royce Trent 7000"
                        },
                        {
                            "name": "APU",
                            "value": "APS3200"
                        }
                    ],
                    "targetDirectory": "headwind-aircraft-a330-900",
                    "alternativeNames": [
                        "A339X",
                        "a339x"
                    ],
                    "tracks": [
                        {
                            "name": "Stable",
                            "key": "A339X-stable",
                            "url": "https://github.com/headwindsim/A339X/releases/download/vstable/",
                            "description": "Stable is our variant that is based on the FlyByWire A32NX stable version and has the fewest issues and best performance. This version won't always up-to-date, but we promise that it will work with all of MSFS's significant updates.",
                            "isExperimental": false,
                            "releaseModel": {
                                "type": "githubRelease"
                            }
                        },
                        {
                            "name": "Development",
                            "key": "A339X-dev",
                            "url": "https://github.com/headwindsim/A339X/releases/download/vmain/",
                            "description": "The most recent features that make it into the next stable will be in development. Bugs should be anticipated. It is updated each time a new commit is added to GitHub's \"main\" branch. \n\n**Please be aware that no support will be offered via Discord support channels.**",
                            "isExperimental": true,
                            "warningContent": "The most recent features that make it into the next stable will be in development. Bugs should be anticipated. It is updated each time a new commit is added to GitHub's \"main\" branch. \n\n**Please be aware that no support will be offered via Discord support channels.**",
                            "releaseModel": {
                                "type": "githubBranch",
                                "branch": "main"
                            }
                        }
                    ],
                    "dependencies": [
                        {
                            "addon": "@headwind/simbridge",
                            "optional": true,
                            "modalText": "SimBridge allows the A339X to expose remote tools like the Web MCDU, as well as use the external terrain database."
                        }
                    ],
                    "incompatibleAddons": [
                        {
                            "title": "Toolbar Pushback",
                            "creator": "AmbitiousPilots",
                            "description": "This add-on sometimes causes performance issues and also prevents the A339X from taxiing. Consider removing it in case of issues."
                        }
                    ],
                    "myInstallPage": {
                        "links": [
                            {
                                "url": "https://docs.flybywiresim.com/fbw-a32nx/",
                                "title": "A32NX Documentation"
                            }
                        ],
                        "directories": [
                            {
                                "location": {
                                    "in": "packageCache",
                                    "path": "work"
                                },
                                "title": "Work Folder"
                            }
                        ]
                    },
                    "disallowedRunningExternalApps": [
                        "@/msfs",
                        "@/mcdu-server"
                    ]
                },
                {
                    "name": "SimBridge",
                    "key": "simbridge",
                    "category": "@simbridge",
                    "repoOwner": "flybywiresim",
                    "repoName": "simbridge",
                    "aircraftName": "FBW SimBridge",
                    "titleImageUrl": "https://flybywiresim.b-cdn.net/installer/media-assets/addon-titles/fbw-simbridge/dark.svg",
                    "titleImageUrlSelected": "https://flybywiresim.b-cdn.net/installer/media-assets/addon-titles/fbw-simbridge/light.svg",
                    "enabled": true,
                    "backgroundImageUrls": [
                        "https://flybywiresim.b-cdn.net/installer/media-assets/addon-headers/fbw-simbridge/0.png"
                    ],
                    "backgroundImageShadow": false,
                    "shortDescription": "Airbus A380-800",
                    "description": "SimBridge is an external application which allows FBW aircraft to communicate with components located outside the simulator. SimBridge will be used for a number of features requiring external data (such as TAWS terrain display), as well as for functionality providing remote access to aircraft systems or data.",
                    "targetDirectory": "flybywire-externaltools-simbridge",
                    "tracks": [
                        {
                            "name": "Release",
                            "key": "release",
                            "releaseModel": {
                                "type": "githubRelease"
                            },
                            "url": "https://cdn.flybywiresim.com/addons/simbridge/release/",
                            "isExperimental": false,
                            "description": "SimBridge is an external app that enables FlyByWire Simulations aircraft to communicate outside your simulator. From remote displays to external terrain display rendering, it is used for a variety of optional features."
                        }
                    ],
                    "disallowedRunningExternalApps": [
                        "@/simbridge-app"
                    ],
                    "backgroundService": {
                        "executableFileBasename": "fbw-simbridge",
                        "runCheckExternalAppRef": "@/simbridge-app",
                        "commandLineArgs": [
                            "--hide"
                        ]
                    },
                    "myInstallPage": {
                        "links": [
                            {
                                "url": "https://docs.flybywiresim.com/simbridge/",
                                "title": "Documentation"
                            }
                        ],
                        "directories": [
                            {
                                "location": {
                                    "in": "package",
                                    "path": "resources"
                                },
                                "title": "Resources"
                            }
                        ]
                    }
                }
            ],
            "buttons": [
                {
                    "text": "A32NX Documentation",
                    "action": "openBrowser",
                    "url": "https://docs.flybywiresim.com/"
                },
                {
                    "text": "Add-Ons",
                    "action": "openBrowser",
                    "url": "https://flightsim.to/add-ons/airbus-a330-900"
                },
                {
                    "text": "Website",
                    "action": "openBrowser",
                    "url": "https://headwindsim.net/"
                },
                {
                    "text": "Discord",
                    "action": "openBrowser",
                    "url": "https://discord.gg/YT3NBnRCCy",
                    "inline": true
                }
            ]
        }
    ],
};
