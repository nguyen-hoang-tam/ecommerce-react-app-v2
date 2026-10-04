# E-Commerce React App

A modern e-commerce application built with:

- **React 19** - UI library
- **Vite 8** - Build tool
- **JavaScript (JSX)** - No TypeScript, plain JSX
- **React Router v7** - Routing
- **Redux Toolkit** - State management
- **Ant Design (antd v6)** - UI components
- **Firebase** - Backend services (Auth + Firestore)

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

## Available Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `npm run dev`     | Start the Vite dev server     |
| `npm run build`   | Build for production          |
| `npm run lint`    | Lint the codebase with oxlint |
| `npm run preview` | Preview the production build  |

## Project Structure

```
src/
├── app/
│   ├── index.js      # App entry wrapper
│   ├── router.jsx    # React Router setup
│   └── store.js      # Redux store configuration
├── components/
│   ├── card/         # Option card components (address, options)
│   ├── layout/       # App layout (Header, Footer)
│   ├── product/      # Product-related components (ProductCard, ProductGrid, RelatedProductCard)
│   └── ui/           # Reusable UI primitives
├── features/
│   ├── auth/         # Auth feature (slice + API)
│   │   ├── authSlice.js
│   │   └── authAPI.js
│   └── product/      # Product feature (slice + API)
│       ├── productSlice.js
│       └── productAPI.js
├── pages/
│   ├── Auth/
│   │   ├── signin/   # Login page
│   │   └── register/ # Register page
│   ├── Home/         # Homepage
│   ├── Payment/      # Payment/checkout page
│   └── ProductDetail/# Product detail page
├── router/
│   └── index.jsx     # Router configuration
├── lib/
│   ├── firebase.js   # Firebase initialization
│   └── utils.js      # Utility functions
├── assets/
├── images/
├── App.jsx
└── main.jsx
```

## Key Routes

| Path           | Page           |
| -------------- | -------------- |
| `/login`       | Sign in        |
| `/register`    | Register       |
| `/home`        | Home           |
| `/product/:id` | Product detail |
| `/payment`     | Payment        |

## Tech Notes

- **State management**: Redux Toolkit with feature-based slices (`auth`, `product`).
- **UI library**: Ant Design v6 with `@ant-design/icons`.
- **Backend**: Firebase (Authentication + Firestore).
- **Path alias**: `@/` maps to `src/`.
