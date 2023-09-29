FROM node:20-alpine

WORKDIR /gomoku-react

ADD ./package.json ./
ADD ./yarn.lock ./
ADD ./tsconfig.json ./
RUN yarn

CMD yarn start

