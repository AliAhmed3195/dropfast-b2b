#!/bin/bash
echo "Stopping any running Node processes..."
pkill -f node || true
sleep 2
echo ""
echo "Generating Prisma Client..."
npx prisma generate
echo ""
echo "Done! You can now start your dev server with: npm run dev"

