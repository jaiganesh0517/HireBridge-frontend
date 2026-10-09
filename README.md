# HireBridge — Frontend

React frontend for HireBridge, a placement/internship portal. Built while preparing for campus placements, as a full-stack portfolio project.

**Live demo:** https://hire-bridge-frontend.vercel.app
**Backend repo:** https://github.com/jaiganesh0517/HireBridge-backend

## What it does

- **Landing page** explains the product and shows how many roles are listed.
- **Students** can register, browse and search jobs (paginated), apply, manage their profile, and track application status.
- **Recruiters** can register, post jobs with eligibility criteria, review applicants (with contact email), and shortlist, select or reject them.
- **Profiles**: a profile page and edit form for both roles, reached from an avatar menu in the navbar.
- Registration shows the server's validation messages, such as the password rule and duplicate email.
- The UI adapts to the logged-in role: each user only sees the links relevant to them, and `/profile` and `/edit-profile` are protected routes.

## Tech stack

- **React** (Vite)
- **React Router**: client-side routing and protected routes
- **Axios**: API calls, with a JWT interceptor attaching the auth token automatically
- **Context API**: auth state shared across the app (persisted in localStorage)
- **Plain CSS**: custom design system (Lora + Inter, ink/paper/gold palette), no component library

## Project structure

```
src/
├── api/axios.js              # Axios instance with JWT interceptor
├── context/AuthContext.jsx   # Auth state (login/logout, persisted in localStorage)
├── components/               # Navbar, ProfileMenu, Footer, ProtectedRoute
├── pages/                    # One file per screen
│   ├── Home.jsx              # Landing page
│   ├── Login.jsx / Register.jsx
│   ├── Jobs.jsx              # Paginated list + search by title/skill
│   ├── Profile.jsx / EditProfile.jsx
│   ├── CreateStudentProfile.jsx / CreateRecruiterProfile.jsx
│   ├── PostJob.jsx / AddBranches.jsx
│   ├── MyApplications.jsx    # Student view
│   ├── MyPostedJobs.jsx      # Recruiter view
│   └── Applicants.jsx        # Recruiter view of applicants for one job
├── index.css                 # Design system
└── App.jsx                   # Routes
```

## Running locally

1. `npm install`
2. Make sure the backend is running at `http://localhost:8080` (see the [backend repo](https://github.com/jaiganesh0517/HireBridge-backend))
3. `npm run dev`
4. Open `http://localhost:5173`

Environment variables (`.env.development` / `.env.production`) control which backend URL the app calls:

```
VITE_API_URL=http://localhost:8080
```

## Deployment

Deployed on [Vercel](https://vercel.com), connected to this GitHub repo for automatic deploys on push to `main`. `VITE_API_URL` is set in Vercel's project settings to point at the live Railway backend.

When the API response shape changes (for example, pagination), deploy the backend first and the frontend second.

## Roadmap

- [ ] Wrap all role-specific routes in `ProtectedRoute`
- [ ] Hide or disable Apply for closed jobs
- [ ] Phone number and resume link in applicant details
- [ ] Toast notifications instead of inline success/error text
- [ ] Richer styling pass on mobile breakpoints
