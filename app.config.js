import "dotenv/config";

export default {
  expo: {
    name: "snu-happetite-dokkaebibul",
    slug: "dokkaebibul",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: process.env.APP_SCHEME,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      usesAppleSignIn: true,
      bundleIdentifier: process.env.IOS_BUNDLE_ID,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleSignIn: {
          certificateHash: process.env.ANDROID_GOOGLE_SHA1,
        },
      },
      edgeToEdgeEnabled: true,
      package: process.env.ANDROID_PACKAGE,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-build-properties",
      "expo-apple-authentication",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.IOS_URL_SCHEME,
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "앱이 사용 중이 아닐 때도 내 위치 정보에 접근하도록 허용합니다.",
          isBackgroundLocationEnabled: true,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
    owner: "happetitea",
  },
};
