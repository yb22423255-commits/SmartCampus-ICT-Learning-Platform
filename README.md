# SmartCampus ICT Learning Platform

Web semester project — React frontend, Express API, MySQL database.

## Local development

### Backend

```bash
cd backend
cp .env.example .env   # edit with your MySQL credentials
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 (API runs on http://localhost:5000).

Optional seed data:

```bash
cd backend
npm run seed
```

---

## Deploy (free tier)

Recommended stack:

| Part | Service | Why |
|------|---------|-----|
| Frontend | [Vercel](https://vercel.com) | Free, great for Vite/React |
| Backend | [Render](https://render.com) | Free Node.js web service |
| MySQL | [Railway](https://railway.app) | Free trial credits include MySQL |

> **Note:** Render’s free tier has no persistent disk. Uploaded files (assignments, lesson files) are kept in memory on the server and **may be lost when the service redeploys or restarts**. Fine for demos; use a VPS or cloud storage for production.

### 1. Push to GitHub

Make sure `backend/.env` is **not** committed (it is in `.gitignore`).

### 2. MySQL on Railway

1. Create a project at [railway.app](https://railway.app).
2. **New → Database → MySQL**.
3. Open the MySQL service → **Connect** → copy `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`.

### 3. Backend on Render

1. [render.com](https://render.com) → **New → Blueprint** (or Web Service).
2. Connect your GitHub repo. Render reads `render.yaml` at the repo root.
3. Set environment variables in the Render dashboard:

| Variable | Value |
|----------|-------|
| `DB_HOST` | Railway `MYSQLHOST` |
| `DB_PORT` | Railway `MYSQLPORT` |
| `DB_USER` | Railway `MYSQLUSER` |
| `DB_PASSWORD` | Railway `MYSQLPASSWORD` |
| `DB_NAME` | Railway `MYSQLDATABASE` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | long random string |
| `LECTURER_CODE` | your lecturer signup code |
| `CLIENT_URL` | your Vercel URL (set after step 4) |
| `ANTHROPIC_API_KEY` | your Anthropic key (for AI assistant) |

4. Deploy. Copy the API URL (e.g. `https://smartcampus-api.onrender.com`).

Optional: seed the database from your machine (point `.env` at Railway MySQL temporarily):

```bash
cd backend
npm run seed
```

### 4. Frontend on Vercel

1. [vercel.com](https://vercel.com) → import the GitHub repo.
2. **Root Directory:** `frontend`
3. **Environment variable:**

   `VITE_API_URL` = your Render API URL (no trailing slash)

4. Deploy. Copy the Vercel URL (e.g. `https://smartcampus.vercel.app`).

### 5. Connect frontend and backend

1. In Render, set `CLIENT_URL` to your Vercel URL.
2. Redeploy the backend so CORS picks up the new origin.
3. Test login, courses, uploads, and the AI assistant.

### Multiple frontend URLs

Set comma-separated origins in `CLIENT_URL`:

```
https://smartcampus.vercel.app,https://smartcampus-git-main-you.vercel.app
```

---

## Environment variables

### Backend (`backend/.env`)

See `backend/.env.example`.

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (no `/api` suffix) |

Local dev uses `frontend/.env.development` (`http://localhost:5000`). Production value is set in the Vercel dashboard.
