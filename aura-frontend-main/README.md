# Aura Client (Frontend)

The frontend of Aura is built using React, Vite, and Material-UI. It is structured according to **Feature-Sliced Design (FSD)** principles to maximize scalability, predictability, and maintainability.

## 📂 Feature-Sliced Design (FSD) Structure

```text
src/
├── app/       # Application initialization (Providers, Routing, Global Styles)
├── pages/     # Routed page components
├── widgets/   # Compositional, self-contained UI blocks (Header, Sidebar)
├── features/  # Business value features (AddHabit, LoginUser)
├── entities/  # Core business entities (HabitCard, UserProfile)
└── shared/    # Reusable cross-project code (UI library, API config, Utils)
```

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite
- **UI Library:** Material-UI (MUI) + Framer Motion
- **State/Data Fetching:** React Query
- **Routing:** React Router DOM

## 🚀 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production into the `dist/` folder.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run preview`: Locally previews the production build.

## 💡 Component Guidelines
- **Dumb Components:** Keep purely visual components inside `shared/ui`.
- **Smart Components:** Bind data fetching and complex state inside `features/` or `widgets/`.
- **Pages:** Pages should ideally only compose `widgets` and `features` and handle routing parameters.
