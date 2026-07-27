const description =
    'A personal finance management application that helps users track income, expenses, and account balances with clarity and control.';
const primaryColor = '#208AEF';
const backgroundColor = '#101011';

const expoOwner = process.env.EXPO_OWNER;
const appleTeamId = process.env.EXPO_APPLE_TEAM_ID;
const iosBundleIdentifier = process.env.EXPO_IOS_BUNDLE_IDENTIFIER;
const iosAppStoreUrl = process.env.EXPO_IOS_APP_STORE_URL;
const androidPackage = process.env.EXPO_ANDROID_PACKAGE;
const androidPlayStoreUrl = process.env.EXPO_ANDROID_PLAY_STORE_URL;
const universalLinkHost = process.env.EXPO_UNIVERSAL_LINK_HOST;

/**
 * @param {import('expo/config').ConfigContext} context
 * @returns {import('expo/config').ExpoConfig}
 */
export default ({ config }) => ({
    ...config,
    description,
    version: '1.0.0',
    name: 'Pocket Pilot',
    slug: 'pocket-pilot',
    supportsTablet: true,
    scheme: 'pocketpilot',
    orientation: 'portrait',
    requireFullScreen: false,
    userInterfaceStyle: 'automatic',
    icon: './assets/images/branding/logo.png',

    // ADDED: Makes the intended targets explicit instead of relying on package detection.
    platforms: ['ios', 'android', 'web'],
    // ADDED: Links the source repository from the Expo project page.
    githubUrl: 'https://github.com/danielgithiomi/pocket-pilot',
    // ADDED: Provides consistent native root-view and Android task-switcher colors.
    backgroundColor,
    primaryColor,

    // MIGRATED: The JSON value was an author string, but Expo expects an account handle.
    ...(expoOwner ? { owner: expoOwner } : {}),

    ios: {
        icon: {
            dark: './assets/images/branding/logo.png'
        },

        // ADDED: Initial App Store build number; increment it for every iOS release.
        buildNumber: '1',

        // MIGRATED: Empty JSON placeholders are only emitted once real values exist.
        ...(appleTeamId ? { appleTeamId } : {}),
        ...(iosAppStoreUrl ? { appStoreUrl: iosAppStoreUrl } : {}),

        // ADDED: Required for standalone/App Store builds.
        ...(iosBundleIdentifier ? { bundleIdentifier: iosBundleIdentifier } : {}),
        // ADDED: Enables verified universal links after the domain is configured.
        ...(universalLinkHost ? { associatedDomains: [`applinks:${universalLinkHost}`] } : {})
    },

    android: {
        adaptiveIcon: {
            backgroundColor,
            monochromeImage: './assets/images/branding/logo.png',
            foregroundImage: './assets/images/branding/logo.png'
        },
        predictiveBackGestureEnabled: false,

        // ADDED: Initial Play Store build number; increment it for every Android release.
        versionCode: 1,
        // ADDED: Financial data should not be copied into automatic device backups.
        allowBackup: false,

        // ADDED: Required for standalone/Play Store builds.
        ...(androidPackage ? { package: androidPackage } : {}),
        ...(androidPlayStoreUrl ? { playStoreUrl: androidPlayStoreUrl } : {}),
        // ADDED: Enables verified Android App Links alongside the custom URL scheme.
        ...(universalLinkHost
            ? {
                  intentFilters: [
                      {
                          action: 'VIEW',
                          autoVerify: true,
                          category: ['BROWSABLE', 'DEFAULT'],
                          data: [{ scheme: 'https', host: universalLinkHost }]
                      }
                  ]
              }
            : {})
    },

    web: {
        output: 'static',
        favicon: './assets/images/branding/logo.png',

        // ADDED: PWA metadata for installation and a consistent launch experience.
        name: 'Pocket Pilot',
        shortName: 'Pocket Pilot',
        description,
        lang: 'en',
        dir: 'ltr',
        display: 'standalone',
        startUrl: '/',
        scope: '/',
        orientation: 'portrait',
        themeColor: primaryColor,
        backgroundColor
    },

    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                imageWidth: 76,
                backgroundColor: primaryColor,
                image: './assets/images/branding/logo.png',
                // ADDED: Documents the intended scaling instead of relying on the default.
                resizeMode: 'contain',
                // ADDED: Prevents a bright splash when the device is using dark appearance.
                dark: {
                    backgroundColor,
                    image: './assets/images/branding/logo.png'
                }
            }
        ]
    ],

    experiments: {
        typedRoutes: true,
        reactCompiler: true
    },

    extra: {
        eas: {
            projectId: ''
        },
        minSplashScreenDuration: 2000,
        storybookEnabled: process.env.STORYBOOK_ENABLED === 'true'
    }
});
