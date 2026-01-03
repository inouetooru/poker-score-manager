@echo off
echo Generating signing key for Poker Score Manager...
echo.
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkey -v -keystore android\poker-score-manager.keystore -alias poker-score-manager -keyalg RSA -keysize 2048 -validity 10000
echo.
echo Done!
pause
