FROM node:20-alpine3.17

WORKDIR /src
COPY package*.json /
EXPOSE 4001

ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "bin/www"]