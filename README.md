# Disruptors

## Setup

### Getting started

You will need:

- `docker` and `docker-compose`
- `nodejs` and `yarn`

### Running locally

First, copy the `.env.example` to `.env` in the root directory.

```
cp .env.example .env
```

Then, it _should_ be as easy as:

```
docker-compose up
```

This will do an initial build of the client and server containers, then start them together.

If you add any `npm` dependencies (or change the build configuration), you will need to rebuild the containers. You can do this with:

```
docker-compose up --build
```

or

```
docker-compose build
docker-compose up
```

## Structure

The server code is in `/backend`, with the server entry point being `backend/src/index.ts`.

The frontend code is in `/frontend`, which is a standard `create-react-app` boilerplate.

The GitHub actions will build the backend and frontend into separate Docker containers.
