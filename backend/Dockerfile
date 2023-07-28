FROM node:20-alpine3.17

WORKDIR /src
COPY package*.json /
EXPOSE 4000

RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "bin/www"]