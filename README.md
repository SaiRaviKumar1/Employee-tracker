# Employee Tracker

A production-ready MERN starter for managing employee records with a React frontend, Express API, and MongoDB database.

## Stack

- Frontend: React + Vite + Axios
- Backend: Node.js + Express + Mongoose
- Database: MongoDB

## Folder structure

```text
employee-tracker/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   `-- hooks/
|   |-- .env.example
|   `-- package.json
|-- .gitignore
|-- package.json
`-- README.md
```

## Features

- Clean frontend and backend separation
- Employee CRUD API with MongoDB persistence
- Search and status filtering
- Centralized backend error handling and security middleware
- Production frontend build support served by the backend
- Environment-based configuration with starter `.env.example` files

## Setup

### 1. Install dependencies

From the project root:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

You can also run:

```bash
npm run bootstrap
```

after the root dependencies are installed.

### 2. Configure environment variables

Create local env files from the provided examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Update `backend/.env` with your MongoDB connection string if you are not using the default local database.

### 3. Run the app in development

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### 4. Build for production

```bash
npm run build
```

This creates the frontend production bundle in `frontend/dist`.

### 5. Start production server

Make sure `NODE_ENV=production` is set and the frontend has been built, then run:

```bash
npm start
```

The backend will serve both the API and the built frontend app.

## API routes

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Suggested next steps

- Add authentication and role-based access control
- Add automated tests for the API and UI
- Add CI/CD and deployment configuration for your target environment
