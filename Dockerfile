FROM node:14.17.6-alpine3.14

RUN apk add --no-cache bash

RUN npm i -g @nestjs/cli@8.1.1

USER node

WORKDIR /home/node/app
