FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm
RUN pnpm install -P 


RUN pnpm run client:build

USER node

CMD ["pnpm", "start", "--prefix", "server"]

EXPOSE 3000
