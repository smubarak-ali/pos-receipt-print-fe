# Stage 1: Build the Angular application
FROM node:26-alpine AS build
RUN apk add --no-cache yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/printer-web/browser /usr/share/nginx/html
COPY --from=build /app/nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 8085
CMD ["nginx", "-g", "daemon off;"]
