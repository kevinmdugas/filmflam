FROM node:18

RUN npm install -g pnpm

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install
COPY . .
EXPOSE 8080
RUN pnpm build

CMD ["pnpm", "startProd"]
