# Painel Selfit

Aplicacao unificada com frontend Vite/React e backend Express/MySQL.

## Estrutura

```text
painel-selfit/
  backend/        API Express com Swagger e MySQL
  src/            Frontend React
  scripts/        Scripts auxiliares
```

## Rodar tudo

Antes, confirme que o MySQL esta rodando e que o arquivo `backend/.env` aponta para o banco correto.

```powershell
npm.cmd run dev
```

URLs locais:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://localhost:3001
Swagger:  http://localhost:3001/api-docs
```

## Comandos separados

```powershell
npm.cmd run dev:backend
npm.cmd run dev:front
```

## Banco

Para aplicar migrations do backend:

```powershell
npm.cmd run migrate:backend
```
