FROM ubuntu:groovy as builder
RUN echo "deb http://archive.ubuntu.com/ubuntu groovy universe " >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

FROM builder as pipenv
RUN apt-get install -y python3-pip
WORKDIR /pipfiles
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
RUN set -ex && pip install pipenv --upgrade
RUN set -ex && pip install --upgrade pip setuptools wheel
RUN set -ex && pipenv install --system --sequential --ignore-pipfile --dev

FROM pipenv as final
WORKDIR /source
COPY ./app/ app/
COPY ./tests/ tests/
