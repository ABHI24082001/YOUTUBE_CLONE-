

  ### Setup State Variables and Dependencies:

1.Import necessary dependencies.
Initialize state variables for managing video data, loading states, and pagination tokens.
Define the Home Component:

2.Create a component to manage the overall state and render different sections of the app.
Fetch Data from YouTube API:

 API_USE = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelType=any&eventType=completed&maxResults=30&q=fun&type=video&videoType=any&key=['API_KEY']`

 API_KEY = `AIzaSyAs_PXPiAbIKhcDM8LuJmRpPt56VHMrkwo`
 

3.Implement a function to fetch video data from the YouTube API.
Handle initial and paginated data fetching.
Load More Data for Infinite Scroll:

4.Create a function to fetch more data when the user scrolls to the end of the list.
Select Video and Handle Layout Changes:

5.Implement functions to handle video selection and adjust layout based on the selection.
Toggle Search Modal:

6Create a function to toggle the visibility of the search modal.
Handle Category Change and Refresh:

7Implement functions to handle changes in video categories and refresh the data.
Render the Component:

8Render the main component, including the header, category buttons, search modal, and video list.
Ensure the video list supports infinite scroll and displays loading indicators.
Styles: use NativeBase , Stylesheet

Add styles to ensure the app has a consistent and visually appealing design.

# React Native Typescript Setup

## Setup Navigation

### Install Navigation Packages

```bash
yarn add @react-navigation/native
yarn add react-native-screens react-native-safe-area-context
```

### Install Pod for above dependencies

```bash
cd ios && arch -x86_64 pod install
```

### Set up `react-native-screens` by updating `android/app/src/main/java/<your package name>/MainActivity.java` file

```java
import android.os.Bundle;

public class MainActivity extends ReactActivity {
  // ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
  // ...
}
```

### Install stack navigation

```bash
yarn add @react-navigation/native-stack
```

### Wrap the navigation with navigation container

```tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}
```

### Install Drawer Navigation package & other dependencies

```bash
yarn add @react-navigation/drawer react-native-gesture-handler react-native-reanimated
cd ios && arch -x86_64 pod install
```

### Setup `react-native-gesture-handler` in `index.js`

```js
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler'; // this line add
AppRegistry.registerComponent(appName, () => App);
```

### Settings up `react-native-reanimated/plugin`

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // this line add
};
```

### Reset the server cache

```bash
yarn start --reset-cache
```

### Install Bottom Navigation package

```bash
yarn add @react-navigation/bottom-tabs
```

### Setup absolute imports

#### Install `babel-plugin-module-resolver`

```bash
yarn add -D babel-plugin-module-resolver
```

#### Update the `babel.config.js` file

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~/assets': './src/assets',
          '~/components': './src/components',
          '~/components/core': './src/components/core',
          '~/components/containers': './src/components/containers',
          '~/components/shared': './src/components/shared',
          '~/configs': './src/configs',
          '~/constant': './src/constant',
          '~/hooks': './src/hooks',
          '~/routes': './src/routes',
          '~/screens': './src/screens',
          '~/styles': './src/styles',
          '~/types': './src/types',
        },
      },
    ],
  ],
};
```

#### Update `tsconfig.json` file

```json
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "~/*": ["*"]
    }
  }
}
```

### Install lottie animation library

```bash
yarn add lottie-react-native lottie-ios@3.4.0
```

### Install Image Picker library

#### Install `react-native-image-crop-picker` library

```bash
yarn add react-native-image-crop-picker
```

#### Update permissions in `AndroidManifest.xml` file for android

```xml
<!-- Camera permission required to access picture from camera -->
<uses-permission android:name="android.permission.CAMERA" />
```

#### Update permission in `info.plist` for ios

```plist
<key>NSPhotoLibraryUsageDescription</key>
<string>This app uses the gallery to update photo of your profile</string>
<key>NSCameraUsageDescription</key>
<string>This app uses the camera to take pictures for updating profile photo</string>
```

### Add Custom Font Family To Your Application

#### Create a file named `react-native.config.js`

```js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts'], // path to the fonts directory
};
```

#### Run the following command to add all the assets to both the platforms

```bash
npx react-native-asset
```

### Install vector icons

#### Install `react-native-vector-icons` and its types

```bash
yarn add react-native-vector-icons
yarn add -D @types/react-native-vector-icons
```

#### For android open `android/app/build.gradle` and add following

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### Update following in `info.plist` for ios

```plist
<key>UIAppFonts</key>
<array>
  <string>AntDesign.ttf</string>
  <string>Entypo.ttf</string>
  <string>EvilIcons.ttf</string>
  <string>Feather.ttf</string>
  <string>FontAwesome.ttf</string>
  <string>FontAwesome5_Brands.ttf</string>
  <string>FontAwesome5_Regular.ttf</string>
  <string>FontAwesome5_Solid.ttf</string>
  <string>Foundation.ttf</string>
  <string>Ionicons.ttf</string>
  <string>MaterialIcons.ttf</string>
  <string>MaterialCommunityIcons.ttf</string>
  <string>SimpleLineIcons.ttf</string>
  <string>Octicons.ttf</string>
  <string>Zocial.ttf</string>
  <string>Fontisto.ttf</string>
</array>
```

#### Install Pod

```bash
cd ios && arch -x86_64 pod install --repo-update && cd ..
```


here the screenshotes 

![WhatsApp Image 2024-05-27 at 9 33 25 PM](https://github.com/ABHI24082001/YOUTUBE_CLONE-/assets/92623606/0e7a299f-0e32-4653-9301-43e87284f09f)
![WhatsApp Image 2024-05-27 at 9 33 24 PM (1)](https://github.com/ABHI24082001/YOUTUBE_CLONE-/assets/92623606/88e075a3-45e1-4a09-abb0-585db1369af5)
![WhatsApp Image 2024-05-27 at 9 33 24 PM](https://github.com/ABHI24082001/YOUTUBE_CLONE-/assets/92623606/dc60324e-8b56-4ccd-814c-58e65a47c867)
