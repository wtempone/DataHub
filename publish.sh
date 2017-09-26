#!/bin/bash
# DataHub

#Instruções para Build Android
#Build Android
ionic cordova build android --release --prod
#Comando opcional para gerar keystore
#keytool -genkey -v -keystore my-release-key.keystore -alias DataHub -keyalg RSA -keysize 2048 -validity 10000

#Assinar Apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk DataHub
#Deleta arquivo se existir
rm -rf platforms/android/build/outputs/apk/DataHub.apk
#Compacta Apk definitivo
$ANDROID_HOME/build-tools/25.0.2/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/DataHub.apk
#Build Ios
ionic cordova build ios --device --prod --release -- --developmentTeam="N37L6B6VW8" --codeSignIdentity="iPhone Developer" 
#ftp
filename="/home/paul/myfile.tar.gz"
hostname="144.210.153.47"
username="william.tempone"
ftp $username@$hostname <<EOF
binary
put versao.json datahub/versao.json
put platforms/android/build/outputs/apk/DataHub.apk datahub/DataHub.apk
put platforms/ios/build/device/DataHub.ipa datahub/DataHub.ipa
quit
EOF