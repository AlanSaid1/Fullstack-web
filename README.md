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
