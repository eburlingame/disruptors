# frontend build
FROM node:16-alpine3.14

WORKDIR /usr/app

ENV PATH /usr/app/node_modules/.bin:$PATH
ENV NODE_ENV development
ENV NODE_OPTIONS --openssl-legacy-provider

COPY package*.json ./
RUN yarn install --frozen-lockfile --production=false
RUN yarn global add typescript
RUN yarn global add react-scripts@4.0.3

COPY . .
EXPOSE 3000
CMD yarn run start
