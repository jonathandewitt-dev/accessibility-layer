FROM node:12.13.1-slim

WORKDIR /accessibility-layer/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start