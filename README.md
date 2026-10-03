# HireBridge — Frontend

React frontend for HireBridge, a placement/internship portal. Built while preparing for campus placements, as a full-stack portfolio project.

**Live demo:** https://hire-bridge-frontend.vercel.app
**Backend repo:** https://github.com/jaiganesh0517/HireBridge

## What it does

- **Students** can register, browse and search open roles, apply, complete their profile, and track application status.
- **Recruiters** can register, post jobs with eligibility criteria, review applicants, and update their status.
- Role-based routing shows each user only the pages relevant to them.

## Tech stack

- **React** (Vite)
- **React Router** — client-side routing, protected routes by role
- **Axios** — API calls, with a JWT interceptor attaching the auth token automatically
- **Context API** — auth state shared across the app

## Project structure
src/
├── api/axios.js # Axios instance with JWT interceptor
├── context/AuthContext.jsx # Auth state (login/logout, persisted in localStorage)
├── components/ # Navbar, Footer, ProtectedRoute
├── pages/ # One file per screen
└── App.jsx # Routes


## Running locally

1. `npm install`
2. Make sure the backend is running at `http://localhost:8080` (see the [backend repo](https://github.com/jaiganesh0517/HireBridge))
3. `npm run dev`
4. Open `http://localhost:5173`

Environment variables (`.env.development` / `.env.production`) control which backend URL the app calls:

VITE_API_URL=http://localhost:8080

## Deployment

Deployed on [Vercel](https://vercel.com), connected to this GitHub repo for automatic deploys on push to `main`. `VITE_API_URL` is set in Vercel's project settings to point at the live Railway backend.

## Roadmap

- [ ] "My Posted Jobs" filtering/sorting
- [ ] Richer styling pass on mobile breakpoints
- [ ] Toast notifications instead of inline success/error text
