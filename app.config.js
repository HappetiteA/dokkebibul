import "dotenv/config";

export default {
  "expo": {
    "name": "snu-happetite-dokkaebibul",
    "slug": "dokkaebibul",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "dokkebibul",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "usesAppleSignIn": true,
      "bundleIdentifier": "com.happetite.dokkebibul",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      "config": {
        "googleSignIn": {
          "certificateHash": process.env.ANDROID_GOOGLE_SHA1
        }
      },
      "edgeToEdgeEnabled": true,
      "package": "com.happetite.dokkebibul"
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
      "expo-notifications",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": process.env.IOS_URL_SCHEME
        }
      ],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#232323",
          image: "./assets/images/splash-icon.png",
          dark: {
            image: "./assets/images/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": process.env.EXPO_PUBLIC_EAS_PROJECT_ID
      }
    },
    owner: "happetitea",
    "updates": {
      "url": `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}`
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  },
};
