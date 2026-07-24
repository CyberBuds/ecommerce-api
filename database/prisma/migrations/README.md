This folder is for Prisma migrations. Run migrations from the workspace with:

pnpm --filter ./apps/api exec prisma migrate dev --schema=database/prisma/schema.prisma

Or generate migration SQL with:

pnpm --filter ./apps/api exec prisma migrate dev --name init --create-only --schema=database/prisma/schema.prisma

Note: Adjust commands for your environment.