export default {
  "expo": {
    "name": "tinder-clone",
    "slug": "tinder-clone",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "plugins": [
      "@react-native-google-signin/google-signin"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "host.exp.exponent",
      "googleServiceFile": process.env.GOOGLE_SERVICES_INFOPLIST
    },
    "android": {
      "googleServiceFile": process.env.GOOGLE_SERVICES_JSON,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "host.exp.exponent"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "c602b294-4c2e-4deb-8417-e862b13911ed"
      }
    }
  }
}
