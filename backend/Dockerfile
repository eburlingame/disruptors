FROM node:current-alpine3.12 as backend
WORKDIR /usr/app

ENV NODE_ENV production
ENV PATH /usr/app/node_modules/.bin:$PATH
COPY . .
RUN yarn install --frozen-lockfile --production=false
RUN yarn global add typescript
RUN tsc --build tsconfig.json

ENV NODE_ENV production
ENV API_PORT 8080
EXPOSE 8080
CMD ["node", "build/index.js"]
