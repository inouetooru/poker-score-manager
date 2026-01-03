@echo off
echo.
echo ============================================
echo  Creating key.properties file
echo ============================================
echo.
echo Please enter your signing key information:
echo.

set /p STORE_PASSWORD="Keystore Password: "
set /p KEY_PASSWORD="Key Password (press Enter if same as keystore password): "

if "%KEY_PASSWORD%"=="" set KEY_PASSWORD=%STORE_PASSWORD%

echo.
echo Creating key.properties with the following content:
echo.
echo storePassword=%STORE_PASSWORD%
echo keyPassword=%KEY_PASSWORD%
echo keyAlias=poker-score-manager
echo storeFile=poker-score-manager.keystore
echo.

set /p CONFIRM="Is this correct? (Y/N): "
if /i not "%CONFIRM%"=="Y" goto :END

(
echo storePassword=%STORE_PASSWORD%
echo keyPassword=%KEY_PASSWORD%
echo keyAlias=poker-score-manager
echo storeFile=poker-score-manager.keystore
) > android\key.properties

echo.
echo [SUCCESS] Created android\key.properties
echo.
echo WARNING: This file contains sensitive information.
echo          Keep it safe and do NOT commit it to Git!
echo.

:END
pause
