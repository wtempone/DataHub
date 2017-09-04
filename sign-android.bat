cd platforms\android\build\outputs\apk
del my-release-key.keystore
"C:\Program Files\Java\jdk1.8.0_121\bin\keytool" -genkey -v -keystore my-release-key.keystore -alias DataHub-WMcCann -keyalg RSA -keysize 2048 -validity 10000
"C:\Program Files\Java\jdk1.8.0_121\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk DataHub-WMcCann
del DataHub-WMcCann.apk
"C:\Users\william.tempone\AppData\Local\Android\sdk\build-tools\25.0.2\zipalign" -v 4 android-release-unsigned.apk DataHub-WMcCann.apk
"C:\Users\william.tempone\AppData\Local\Android\sdk\build-tools\25.0.2\apksigner" verify DataHub-WMcCann.apk
explorer .
cd ..\..\..\..\..
