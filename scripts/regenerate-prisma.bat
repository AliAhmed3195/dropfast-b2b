@echo off
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Generating Prisma Client...
npx prisma generate
echo.
echo Done! You can now start your dev server with: npm run dev
pause

