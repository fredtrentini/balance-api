# balance-api

A simple API that simulates interaction with a bank account.

## How to install

Either run the project with docker or install locally.

### Option 1: Run with docker

#### 1. Build the image

Run on the project root: `docker build -t balance-api .`

#### 2. Run the container

`docker run -p 3000:3000 balance-api`

Access the container at: `http://localhost:3000`

### Option 2: Run locally

#### 1. Install NodeJS + NPM

- If using windows: [Run node.js installer](https://nodejs.org/en/download/current)
- If using linux/macOS: `sudo apt install nodejs npm`

#### 2. Install dependencies

```sh
npm i
```

#### 3. Run the project

```sh
npm run prod
```

## Tests

This project contains tests made with jest + typescript, to run tests use: `npm run test`

## Endpoints overview

This project contains 3 endpoints:

- `GET /balance`: returns balance for a given user

    Example:
    `GET /balance?account_id=123` => `10`

- `POST /event`: process a payment related event, which can be either `deposit`, `withdraw` or `transfer`

    Example:
    `POST /event { "type": "deposit", "destination": "100", "amount": 10 }` => `{ "destination": { "id": "100", "balance": 10 }}`

- `POST /reset`: completely resets server state

    Example:
    `POST /reset` => `OK`

For more details about routes and their use cases, take a look at integration tests: `src/controllers/__tests__/AccountController.test.ts`
