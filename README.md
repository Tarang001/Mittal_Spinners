# Mittal Spinner Monorepo

Production-ready monorepo for Railway deployment:

- `client/`: React + Vite frontend
- `server/`: Express + Prisma backend

## Project Structure

```text
.
├── client
│   ├── src
│   ├── public
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server
│   ├── prisma
│   ├── routes
│   ├── controllers
│   ├── services
│   ├── index.js
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/mittal_spinner
JWT_SECRET=replace-with-strong-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
CORS_ORIGIN=https://your-frontend-domain.com
```

Optional client env (`client/.env`):

```env
VITE_API_URL=
```

- Leave `VITE_API_URL` empty in production when serving frontend from the same Express origin.
- Set `VITE_API_URL` to a full URL only if API is hosted on a separate domain.

## Local Development

Install all workspace dependencies:

```bash
npm install
```

Run frontend + backend in parallel:

```bash
npm run dev
```

## Build and Run (Production Mode)

Build frontend and generate Prisma client:

```bash
npm run build
```

Apply migrations:

```bash
npm run prisma:migrate:deploy
```

Start server (serves API + `client/dist`):

```bash
npm start
```

## Railway Deployment

Deploy as a single service with backend as entrypoint.

- **Root Directory**: repository root
- **Build Command**: `npm install && npm run build && npm run prisma:migrate:deploy`
- **Start Command**: `npm start`

Required Railway variables:

- `PORT` (Railway injects this automatically)
- `DATABASE_URL`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CORS_ORIGIN` (set to your Railway frontend domain if needed)

### Notes

- Server binds to `process.env.PORT`.
- Express serves static files from `client/dist`.
- Unknown non-API routes fallback to `client/dist/index.html`.
