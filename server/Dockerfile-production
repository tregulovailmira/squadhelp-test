FROM node:10.15.0

ARG NODE_ENV="production"

RUN mkdir ./server

RUN mkdir -p /var/www/html/images/


WORKDIR /server

COPY package*.json ./

RUN npm install -g sequelize-cli

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD node ./dist/index.js
