FROM node:lts-alpine AS deps
WORKDIR /app
RUN npm i -g pnpm

# Copy only the files needed for dependency installation
COPY package.json ./

# For client
COPY client/package.json client/pnpm-lock.yaml* ./client/
RUN mkdir -p client && pnpm install --prefix client --prod
COPY client/ ./client

# For server
COPY server/package.json server/pnpm-lock.yaml* ./server/
RUN mkdir -p server && pnpm install --prefix server --prod
COPY server/ ./server

COPY client/ client/
RUN pnpm --prefix client run build

COPY server/ server/

USER node

CMD ["pnpm", "start", "--prefix", "server"]

EXPOSE 3000
