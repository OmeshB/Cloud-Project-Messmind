FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Build only the client bundle (nginx serves static files, not the Express server)
RUN npm run build:client

FROM nginx:alpine
# Client output goes to dist/spa (see vite.config.ts build.outDir)
COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]