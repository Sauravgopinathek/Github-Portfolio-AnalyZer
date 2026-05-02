# Stage 1: Build the frontend
FROM node:18 AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Set up the backend
FROM node:18-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
# Copy the built frontend to a 'public' directory in the server folder
COPY --from=build-stage /app/client/dist ./public

EXPOSE 8080
ENV PORT=8080

CMD ["node", "index.js"]
