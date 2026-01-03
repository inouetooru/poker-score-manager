@echo off
echo.
echo ============================================
echo  Building Release AAB for Google Play
echo ============================================
echo.

REM Set JAVA_HOME to Android Studio's JDK
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Using Java from: %JAVA_HOME%
echo.

cd android

echo Running Gradle bundleRelease...
echo This may take a few minutes...
echo.

call gradlew.bat bundleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo  [SUCCESS] Build completed!
    echo ============================================
    echo.
    echo AAB file location:
    echo   app\build\outputs\bundle\release\app-release.aab
    echo.
    echo This file is ready to upload to Google Play Console.
    echo.
) else (
    echo.
    echo ============================================
    echo  [ERROR] Build failed!
    echo ============================================
    echo.
    echo Please check the error messages above.
    echo.
)

cd ..
pause
