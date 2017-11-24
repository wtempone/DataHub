# DataHub
Instruções para assinar app para android

keytool -genkey -v -keystore my-release-key.keystore -alias DataHub -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk DataHub
rm -rf platforms/android/build/outputs/apk/DataHub.apk
$ANDROID_HOME/build-tools/25.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/DataHub.apk

comando para instalar em device
adb -d install platforms/android/build/outputs/apk/DataHub.apk


Instruções para assinar app para ios
Distribution manifest information

Nome
DataHub #
App URL
https://app.wmccann.com/DataHubApp/DataHub.ipa #
Display Image URL
https://app.wmccann.com/DataHubApp/icon.png #
FUll Display Image URL
https://app.wmccann.com/DataHubApp/icon.512x512.png #