# BondSwap API

## Description

BondSwap is an application for buying and selling bonds. This document provides instructions for configuring and running the application locally.

## Requirements

- Go 1.16+
- PostgreSQL
- Git
- Docker y Docker Compose

## Configuration

1. Clone the repository:
    ```sh
    git clone https://github.com/AlanSaid1/Fullstack-web.git
    cd Fullstack-web
    ```

2. Download the recommended WSL extension for Linux in VSC

3. Download the Go extension in VSC

4. If problems exists in Docker Desktop, do the following:

- Open PowerShell as Admin
- Run the following command for updates:
```sh
wsl --update
```

5. Start with the Docker ecosystem:

In the visual studio terminal, run:

```sh
docker compose up --build
```

6. posible problem:
rename the footer component to Footer.tsx

# API Endpoints and How to Test Them

## User Registration

### `POST /api/go/users`

**Description**: Registers a new user in the system.

**Request Body**:
```json
{
  "username": "new_user",
  "password": "secure_password",
  "email": "email@example.com"
}
```
**response example **:
```json
{
  "id": 1,
  "username": "new_user",
  "email": "email@example.com"
}

```

Testing in Postman:

- Select the POST method.
- Enter the URL: http://localhost:8080/api/go/users.
- In the Body tab, select raw and JSON.
- Enter the JSON request body.
- Click Send.

## User Authentication

### `POST /api/go/login`

**Description**: Authenticates a user and returns a JWT token.

**Request Body**:
```json
{
  "username": "user",
  "password": "password"
}

```

**response example **:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Testing in Postman:

- Select the POST method.
- Enter the URL: http://localhost:8080/api/go/login.
- In the Body tab, select raw and JSON.
- Enter the JSON request body.
- Click Send.

## Create a bond

### `POST /api/go/bonds`

**Description**: Creates a new bond.

**Request Body**:
```json
{
  "name": "Example Bond",
  "number": 100,
  "price": 1000.00,
  "currency": "MXN"
}
```

**response example **:
```json
{
  "id": 1,
  "name": "Example Bond",
  "number": 100,
  "price": 1000.00,
  "currency": "MXN",
  "seller_id": 1
}
```

Testing in Postman:

- Select the POST method.
- Enter the URL: http://localhost:8080/api/go/bonds.
- In the Body tab, select raw and JSON.
- Enter the JSON request body.
- In the Headers tab, add a key Authorization with the value Bearer <your_token>.
- Click Send.

## Get available bonds

### `GET /api/go/bonds`

**Description**: Retrieves the list of available (unsold) bonds.

**response example **:
```json
[
  {
    "id": 1,
    "name": "Example Bond",
    "number": 100,
    "price": 1000.00,
    "currency": "MXN",
    "seller_id": 1,
    "buyer_id": null
  }
]
```
Testing in Postman:

- Select the GET method.
- Enter the URL: http://localhost:8080/api/go/bonds.
- Click Send.

## Get user bonds

### `GET /api/go/bonds/user`

**Description**: Retrieves the list of bonds owned by the authenticated user.

**response example **:
```json
[
  {
    "id": 1,
    "name": "Example Bond",
    "number": 100,
    "price": 1000.00,
    "currency": "MXN",
    "seller_id": 1,
    "buyer_id": 2
  }
]
```

Testing in Postman:

- Select the GET method.
- Enter the URL: http://localhost:8080/api/go/bonds/user.
- In the Headers tab, add a key Authorization with the value Bearer <your_token>.
- Click Send.

## Buy a bond

### `POST /api/go/bonds/{id_of_bond}/buy`

**Description**: Buys an available bond.

**response example **:
No Content (204)

Testing in Postman:

- Select the POST method.
- Enter the URL: http://localhost:8080/api/go/bonds/{id}/buy (replace {id} with the ID of the bond to buy).
- In the Headers tab, add a key Authorization with the value Bearer <your_token>.
- Click Send.
