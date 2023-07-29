# DEMYST-TASK

## Parts

1. backend (express.js app)

For API, checkout api.yaml.

2. accounting-provider (express.js app)

For API, checkout api.yaml.

3. decision-engine (express.js app)

For API, checkout api.yaml.

4. frontend (next.js app)

## Running through docker-compose

1. Install Docker and git
2. Run `git clone https://github.com/abhinavzspace/demyst-task.git`
3. `cd demyst-task`
4. Create `.env` for frontend by running `cp ./frontend/sample.env ./frontend/.env`. (#TODO: Need to remove this step)
5. Run `docker compose up`

## Running manually

1. Install Docker and git
2. Run `git clone https://github.com/abhinavzspace/demyst-task.git`
3. `cd demyst-task`
4. Create `.env` by running `cp ./frontend/sample.env ./frontend/.env` and `cp ./backend/sample.env ./backend/.env`
5. Run `npm install`
6. Run instance of redis locally or run `docker run --name some-redis -d -p 6379:6379 redis`
7. Run `npm run dev` at root.

## How to use

- You can check and test all the APIs on swagger, by going to:

  1. http://localhost:4000/swagger
  2. http://localhost:4001/swagger
  3. http://localhost:4002/swagger

- Connect to frontend on http://localhost:3000.

### Important pages:

- frontend - `/frontend/app/page.tsx`
- backend - `/backend/controllers/*`
- accounting-provider - `/backend/controllers/balanceSheet.js`
