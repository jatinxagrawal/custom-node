FROM node:alpine as build

WORKDIR /app

COPY ./package.json /app

COPY ./package-lock.json /app

RUN npm ci --production

COPY . /app

RUN npm run build

#NGINX web server

FROM nginx:1.12-alpine as prod

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"  ]
