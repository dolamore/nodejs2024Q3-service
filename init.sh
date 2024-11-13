#!/bin/sh

rm -rf prisma/migrations

npx prisma migrate deploy
npx prisma generate
npx prisma migrate dev --name init --skip-seed

npm run build

npm run start:dev-src