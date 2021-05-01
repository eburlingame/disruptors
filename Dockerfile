# frontend build
FROM node:current-alpine3.12 as frontend
WORKDIR /usr/app
ENV PATH /usr/app/node_modules/.bin:$PATH
ENV NODE_ENV production
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./
RUN yarn install --frozen-lockfile --production=false
RUN yarn global add typescript
RUN yarn global add react-scripts@3.4.1
COPY frontend/ ./
RUN yarn run build

# server build
FROM ubuntu:groovy as builder
RUN echo "deb http://archive.ubuntu.com/ubuntu groovy universe " >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y python3-pip
WORKDIR /pipfiles
COPY backend/Pipfile Pipfile
COPY backend/Pipfile.lock Pipfile.lock
RUN set -ex && pip install pipenv --upgrade
RUN set -ex && pip install --upgrade pip setuptools wheel
RUN set -ex && pipenv install --system --sequential --ignore-pipfile --dev
WORKDIR /source
COPY --from=frontend /usr/app/build /source/frontend
COPY ./backend/app/ /source/app
COPY ./backend/tests/ /source/tests
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0",  "--port", "8080", "--lifespan=on", "--use-colors",  "--loop", "uvloop",  "--http", "httptools"]
