# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started/)

## Downloading

```
git clone https://github.com/dolamore/nodejs2024Q3-service.git
```

## Installing NPM modules

```
npm install
```

## Pulling Docker Images
```
docker pull dolamore/nodejs2024q3-service:postgres17
```
```
docker pull dolamore/nodejs2024q3-service:app
```


## Running application
To build the docker-compose.yml file and start the container in background mode

```
docker compose up --build -d
```

To build the docker-compose.yml file and start the container

```
docker compose up --build
```

## Testing

After application running in background mode, open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
