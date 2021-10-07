FROM node:12.18.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production
COPY . .

CMD [ "npm", "start" ]
