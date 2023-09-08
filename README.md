# Waygo

## Run Frontend Locally

Go to the frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Copy .env.sample to .env

Set the backend url in .env

e.g.

```
REACT_APP_BACKEND_URL=http://192.168.1.18:8000/api
```

Start the server

```bash
  npm run start
```

## Run Backend Locally

Go to the backend directory

```bash
  cd backend
```

Copy .env.template to .env and fill appropriate data

```bash
  cp .env.template .env
```

Build Docker Image

```bash
  docker-compose build
```

Start Backend using Docker

```bash
  docker-compose up -d
```

Stop Backend using Docker

```bash
  docker-compose down
```
