FROM node:lts-alpine AS deps
WORKDIR /app
RUN npm i -g pnpm

# Copy only the files needed for dependency installation
COPY package.json ./

# Client Dependencies
COPY client/package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm client:install -P 

# Server Dependencies
COPY server/package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm server:install -P 

COPY client/ client/
RUN pnpm client:build

COPY server/ server/

USER node

CMD ["pnpm", "start", "--prefix", "server"]

EXPOSE 3000
