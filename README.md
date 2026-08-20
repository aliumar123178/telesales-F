# Nexora Telesales — Frontend

A mobile-first React frontend for a telesales agent CRM: login, agent dashboard,
service catalog, new-subscriber registration flow, and primary offer selection.

This is a generic, freely-brandable rebuild — not affiliated with or a copy of any
telecom operator's proprietary application. Swap the name, colors, and copy for
your own use.

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- React Hook Form + Zod (validation)
- Axios (API layer, expects a backend at `/api`)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Runs at `http://localhost:5173`. API calls are proxied to `http://localhost:4000`
in development (see `vite.config.js`), matching the companion backend scaffold.

## Structure

```
src/
  components/
    common/     Button, Input, Card, Loader, SectionLabel
    layout/     Navbar, BottomNav, AppLayout
  pages/
    auth/       Login, Signup, ForgotPassword
    Home, Services, NewSubscriber, PrimaryOffer,
    SupplementaryOffer, Messages, Profile
  context/      AuthContext (session state)
  hooks/        useAuth
  services/     api.js (axios instance), authService, subscriberService, offerService
  router/       AppRoutes, ProtectedRoute
```

## Notes

- Auth token is stored in `localStorage` and attached to every request via an
  Axios interceptor; a 401 response clears the session and redirects to `/login`.
- All data-fetching pages (`Home`, `PrimaryOffer`) call real service functions —
  point them at your backend, or stub the service files to return mock data
  while you build the API.
- Every screen is mobile-first (max-width container, bottom tab nav) since the
  original flow this is modeled on is a phone-based agent app.

## Building for production

```bash
npm run build
```

Outputs static assets to `dist/`.
