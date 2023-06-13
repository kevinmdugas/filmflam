FROM node:18 as build-stage

RUN npm install -g pnpm

WORKDIR /app
COPY ./nginx.conf /nginx.conf
COPY package*.json /app/
RUN pnpm install

COPY ./ /app/
RUN pnpm build


FROM nginx:alpine
EXPOSE 80
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

