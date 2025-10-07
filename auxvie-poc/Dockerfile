# Node LTS slim image
FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3030
CMD [ "npm", "start" ]
