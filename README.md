# FINOVA AI

FINOVA AI is a full-stack financial operations and verification platform built with a modern fintech dashboard experience.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Database: MongoDB Atlas
- AI: Gemini-compatible integration
- Auth: JWT
- Charts: Recharts
- Icons: Lucide React

## Structure

- `frontend/` - React application with authentication, dashboard, loan application, analytics, and AI timeline pages.
- `backend/` - Express API with user auth, loan workflows, Gemini AI analysis integration, and MongoDB models.

## Setup

### Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Update `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `FRONTEND_URL`
5. `npm run seed` to seed demo data
6. `npm start`

### Frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Update `VITE_API_BASE_URL`
5. `npm run dev`

## Deployment

- Frontend deploy to Vercel
- Backend deploy to Render or any Node host
- MongoDB Atlas connection setup via `MONGO_URI`

## Notes

- The backend uses a Gemini-compatible AI service; configure your API key and model in the backend `.env`.
- Seeded demo data includes sample loan applications, AI activity logs, and workflow states.
