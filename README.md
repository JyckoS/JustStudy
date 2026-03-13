# JustStudy API

Node.js + Express REST API for authentication and study session tracking.

## Stack
- Express, PostgreSQL, JWT, bcryptjs

## Setup

```bash
npm install
node index.js
```

**.env**
```
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

## Routes

| Method | Endpoint | Auth Required | Body |
|--------|----------|---------------|------|
| POST | `/auth/register` | No | `email`, `password` |
| POST | `/auth/login` | No | `email`, `password` |
| GET | `/auth/validate-token` | Yes | — |
| POST | `/study/add` | Yes | `minutes` |
| GET | `/study/total` | Yes | — |
| GET | `/study/history` | Yes | — |

Protected routes require `Authorization: Bearer <token>` header.
