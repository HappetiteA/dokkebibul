import 'dotenv/config'

export default {
  "expo": {
    "name": "snu-happetite-dokkaebibul",
    "slug": "dokkaebibul",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "snuhappetitedokkaebibul",
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
      "bundleIdentifier": "com.1n1tial.snuhappetitedokkaebibul",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "config": {
        "googleSignIn": {
          "certificateHash": "20:C7:27:42:EF:9D:A2:78:0D:E6:67:19:36:ED:A9:1A:8B:F1:0A:7C"
        }
      },
      "edgeToEdgeEnabled": true,
      "package": "com.dokkaebibul.snu_happetite"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-build-properties",
      "expo-apple-authentication",
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.537703566025-31nn1n7g9rn5edmuddu20o64d97ugkqm"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "54157097-feaf-4da9-a259-32b5eab2352b"
      }
    },
    "owner": "happetitea"
  }
}
