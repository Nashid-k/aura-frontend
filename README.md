# Aura — Habit & Personal Growth App (Frontend)

Aura is a React single-page application for habit building and personal growth. It pairs a daily habit workflow with progress insights, identity reflections, journaling, reminders and an AI-coach experience.

## Product areas

- **Today:** daily habit checklist and routines
- **Progress:** habit trends, progress summaries and heatmaps
- **Habit details:** individual habit history and statistics
- **Identity:** identity-oriented goals and reflections
- **Journal:** daily journaling
- **Reminders:** reminder management
- **Vault:** saved items and personal resources
- **Achievements:** milestone and reward views
- **AI coach:** conversational support and habit context

## Current stack

- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4 with the Vite plugin
- TanStack Query
- Axios
- Framer Motion
- Radix UI primitives
- React Markdown

## Architecture

The frontend is organized around application providers, page-level routes, domain entities and shared UI/utilities.

```text
src/
├── app/                 # Auth, dashboard and theme providers; route guards
├── entities/            # Habit and sigil UI entities
├── pages/               # Today, progress, journal, identity and other pages
└── shared/
    ├── api/              # Axios client
    ├── lib/              # Query hooks and utilities
    └── ui/               # Shared components and application shell
```

## Run locally

```bash
git clone https://github.com/Nashid-k/aura-frontend.git
cd aura-frontend
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL printed in the terminal (normally [http://localhost:5173](http://localhost:5173)).

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL. Leave empty for local Vite proxying; set the deployed API base URL for production. |

Vite exposes `VITE_*` variables in browser code. Do not place private credentials in this variable.

## Scripts

- `npm run dev` — start Vite
- `npm run build` — create production assets
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Related repository

[Aura backend](https://github.com/Nashid-k/aura-backend) provides authentication, habit, journal, mood, dashboard, AI and insights APIs.
