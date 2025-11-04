ARG APP_NAME=my-app

# Development stage
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
USER node

# Build stage
FROM node:20-alpine AS build
ARG APP_NAME

WORKDIR /usr/src/app
COPY package*.json ./

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npx nx build $APP_NAME

ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force
USER node

# Production stage
FROM node:20-alpine AS production
ARG APP_NAME
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/dist/apps/$APP_NAME ./dist

CMD ["node", "dist/main.js"]
