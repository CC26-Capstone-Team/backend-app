FROM node:current-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./

COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

COPY . .

RUN pnpm db:generate

RUN pnpm build

EXPOSE 4000

CMD sh -c "pnpm db:migrate:prod && pnpm start"