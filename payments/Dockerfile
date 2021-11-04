FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./ ./

RUN npm run build

RUN rm -r src

CMD ["npm", "run", "start:prod"]