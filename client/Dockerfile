# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY . ./
RUN npm ci
RUN CI=true npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/templates /etc/nginx/templates

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]