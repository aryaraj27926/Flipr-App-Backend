FROM node:17-alpine3.14 AS build

RUN mkdir /app

COPY ./package.json ./app

WORKDIR /app

RUN npm install

WORKDIR /

COPY . ./app

WORKDIR /app

RUN npm run script

CMD ["npm", "start"]