# BondSwap API

## Descripción

BondSwap es una aplicación para la compra y venta de bonos. Este documento proporciona instrucciones para configurar y ejecutar la aplicación localmente.

## Requisitos

- Go 1.16+
- PostgreSQL
- Git
- Docker y Docker Compose
- npm instalado

## Configuración

1. Clona el repositorio:
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
