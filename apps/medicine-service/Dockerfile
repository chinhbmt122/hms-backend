FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy toàn bộ source và build
COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS runner

WORKDIR /app

# Thiết lập NODE_ENV để giảm footprint
ENV NODE_ENV=production

# Chỉ copy file cần thiết cho runtime
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]


# FROM node:20-alpine AS builder
#
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# CMD [ "npm", "run", "start:dev" ]
