# Building

## Android

- Key store: `anroid/app/android-signing-keystore-babyapp`
- Alias: `babyapp key`
- Passwords: [See Google Drive](https://docs.google.com/spreadsheets/d/1SxIjDNHYO15VIfxz_lHJbYyGTA3NBKH_3yzSeDb25Us/edit#gid=0)

The app is transfered, and the keystore is from the former developers.
The keystore doesn't work properly. 
You CAN'T build a release like a normal React Native app through the command line. It gives an error about wrong password or it has been tampered with.
It may not work with Fastlane.

- Manually build the js bundle - In the main folder run from the command line:
`react-native bundle --platform android --dev false --entry-file index.js   --bundle-output android/app/src/main/assets/index.android.bundle   --assets-dest android/app/src/main/res/`

- Open the Android part of the project in Android Studio.
- Bump the 'Version Code' in build.gradle (App)
- Select Build -> Generate Signed APK and follow the wizard.
- Check both 'Signature versions'


## iOS

From the iOS folder:

- TestFlight: `fastlane beta`
- Release: `fastlane release` 


## New Language

 - VideoSide component, add new banner
 - config/strings.js - All text goes here
 - Menu component, add new Share url, near the bottom.
 - Because the language is handled by the app itself, new segment has to be added on OneSignal.


## New Category
 - The customer can add in the backend and on the stores by himself.
 - New OneSignal segment needs to be set up. 



 #### Notes

 There are different players for iOS and Android.
 Android is in VideoPlayerScreen
 iOS is in a method in VideoScreen


# Android Notes
Use `react-native run-android --appId dat1.videoplatform.android.babyapp`, since the ID and package is not the same.



# iOS Notes

## IOS build errors 10:
React Native Config.h not found
```
close Xcode.
cd <Project-Folder>/node_modules/react-native/third-party/glog-0.3.4
Run ./configure
Run make
Run make install
Open Xcode and try building the Project.
```

## IOS Build errors xcode 11:
Unkown argument type '_attribute_'
```
https://github.com/facebook/react-native/pull/25146/files#diff-263fc157dfce55895cdc16495b55d190
```

No member named '__rip' in '__darwin_arm_thread_state64' glogπ
Changes to: return NULL;
```
void* GetPC(void* ucontext_in_void) {
#if (defined(HAVE_UCONTEXT_H) || defined(HAVE_SYS_UCONTEXT_H)) && defined(PC_FROM_UCONTEXT)
  if (ucontext_in_void != NULL) {
    ucontext_t *context = reinterpret_cast<ucontext_t *>(ucontext_in_void);
    return NULL;
  }
#endif
  return NULL;
}
```