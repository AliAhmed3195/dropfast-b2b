@echo off
REM Build script for Dropfast Docker image (Windows)
REM Usage: build.bat [staging|production] [push] [tag]

setlocal enabledelayedexpansion

set BUILD_ENV=%1
if "%BUILD_ENV%"=="" set BUILD_ENV=staging

set PUSH=%2
if "%PUSH%"=="" set PUSH=false

set VERSION=%3
if "%VERSION%"=="" set VERSION=latest

set IMAGE_NAME=dropfast
if "%IMAGE_NAME%"=="" set IMAGE_NAME=dropfast

set REGISTRY=%REGISTRY%
if "%REGISTRY%"=="" set REGISTRY=

REM Validate build environment
if not "%BUILD_ENV%"=="staging" if not "%BUILD_ENV%"=="production" (
    echo Error: BUILD_ENV must be 'staging' or 'production'
    exit /b 1
)

echo ========================================
echo Building Dropfast Docker Image
echo ========================================
echo Environment: %BUILD_ENV%
echo Image: %REGISTRY%%IMAGE_NAME%:%VERSION%
echo Push: %PUSH%
echo.

REM Build the image
echo Building Docker image...
docker build --build-arg BUILD_ENV=%BUILD_ENV% -t %REGISTRY%%IMAGE_NAME%:%VERSION% -t %REGISTRY%%IMAGE_NAME%:%BUILD_ENV%-latest .

if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo Build successful!

REM Show image size
echo.
echo Image size:
docker images %REGISTRY%%IMAGE_NAME%:%VERSION% --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

REM Push if requested
if "%PUSH%"=="push" (
    if "%REGISTRY%"=="" (
        echo Warning: No registry specified. Skipping push.
        echo Set REGISTRY environment variable to push.
    ) else (
        echo.
        echo Pushing image to registry...
        docker push %REGISTRY%%IMAGE_NAME%:%VERSION%
        docker push %REGISTRY%%IMAGE_NAME%:%BUILD_ENV%-latest
        
        if errorlevel 1 (
            echo Push failed!
            exit /b 1
        )
        echo Push successful!
    )
)

echo.
echo ========================================
echo Build complete!
echo ========================================
echo.
echo To run the container:
echo   docker run -p 3000:3000 %REGISTRY%%IMAGE_NAME%:%VERSION%
echo.
