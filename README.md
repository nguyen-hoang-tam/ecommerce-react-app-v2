# E-Commerce React App

A modern e-commerce application built with:

- **React 18+** - UI library
- **Vite 5** - Build tool
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Redux Toolkit** - State management
- **TailwindCSS + shadcn/ui** - Styling & components
- **React Hook Form + Zod** - Form handling & validation
- **Firebase** - Backend services

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Firebase credentials.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── store.ts        # Redux store configuration
│   └── router.tsx      # React Router setup
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Header, Footer, Layout)
│   └── common/         # Shared components (LoadingSpinner, etc.)
├── features/
│   └── auth/           # Auth feature (slice + API)
│       ├── authSlice.ts
│       └── authAPI.ts
├── pages/
│   ├── Home/
│   └── Auth/
├── hooks/              # Custom hooks
├── lib/
│   ├── firebase.ts     # Firebase initialization
│   ├── utils.ts        # Utility functions
│   └── validations.ts  # Zod validation schemas
├── types/              # TypeScript type definitions
├── App.tsx
└── main.tsx
```
