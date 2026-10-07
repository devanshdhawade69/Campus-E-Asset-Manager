# Campus E-waste Inventory & Disposal Tracker

A lightweight web application for tracking electronic waste on a campus. 

## Features
- **React + Vite** front-end (TypeScript) with Formik and Yup for form validation.
- **Node/Express** back-end (Currently using an **in-memory data store** for quick setup and demonstration).
- Simple email / roll-no / password authentication using JWT and bcrypt.
- CRUD for e-waste items and bulk CSV import/export.
- Interactive inventory dashboard using Chart.js.

## Prerequisites

- Node 20+ and npm

## Local Setup

### 1. Back-end Setup
Open a terminal and run the following commands:
```bash
cd backend
npm install
npm run dev
```
The back-end server will start and listen on `http://localhost:5000`.

  up
Open a second terminal and run:
```bash
cd frontend
npm install
npm run dev
```
The front-end app will start and be accessible at `http://localhost:3000`.

## Project Structure

```text
frontend/
  src/
    components/  # React components (ItemForm, Dashboard, ItemList)
    pages/       # Page views (Login)
    services/    # API configurations and Auth context
    ...
backend/
  src/
    middleware/  # JWT Authentication guards
    models/      # TypeScript data interfaces
    routes/      # Express API routes (auth, items)
    ...
```

## Next Steps (Planned Roadmap)

- Integrate **MongoDB** (Mongoose) to persist data and replace the in-memory store.
- Add unit and integration tests (Jest + Supertest + mongodb-memory-server).
- Add PDF reporting, SSO integration, and polish the UI styling.
- Deploy to Vercel (frontend) and Render (backend).
