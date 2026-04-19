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

## Setup (MongoDB Version)

You can either **clone the repository** or **download the source code (ZIP)** from the Releases section.

---

### Option 1: Clone the repository
git clone https://github.com/SaiRaviKumar1/Employee-tracker.git

cd Employee-tracker

---

### Option 2: Download ZIP
- Go to Releases
- Download the desired version (v2.0-mongodb)
- Extract the ZIP file
- Open the project folder

---

### Backend Setup

cd backend
npm install

Create a `.env` file inside the `backend` folder and add:

MONGODB_URI=your_mongodb_connection_string
PORT=5000

---

### MongoDB Setup

- Go to MongoDB Atlas
- Create a free cluster
- Click "Connect"
- Choose "Drivers"
- Copy the connection string
- Paste it into `.env`

---

### Run the project

Backend:
npm run dev

Frontend:
cd ../frontend
npm install
npm run dev

## API routes

- `GET /api/health`
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`


## 🚀 Download Versions

- 🟣 [Employee Tracker (v2.1)](https://github.com/SaiRaviKumar1/Employee-tracker/releases/tag/v2.1-auth)
- 🔵 [MongoDB Version (v2.0)](https://github.com/SaiRaviKumar1/Employee-tracker/releases/tag/v2.0-mongodb)
- 🟢 [Local Version (v1.0)](https://github.com/SaiRaviKumar1/Employee-tracker/releases/tag/v1.0-local)

