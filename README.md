# HR Dashboard — Employee Management

A modern, high-performance React + TypeScript HR Dashboard built with Vite, Tailwind CSS, and Recharts. This project supports both fully mocked client-side execution and a local mock JSON database server.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher is recommended).

### 1. Installation
First, install the project dependencies:
```bash
npm install
```

### 2. Running the Application

You can run the application in two different modes:

#### Option A: Dev Mode with Real Backend Server (Recommended)
This runs the JSON server backend (running on port `5001`) and the Vite frontend server concurrently. Data modifications (adding, updating, or deleting employees) will persist directly to the `db.json` file.
```bash
npm run dev:real
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API URL:** [http://localhost:5001](http://localhost:5001)

#### Option B: Dev Mode with In-Memory Mock API (Frontend Only)
This runs only the Vite frontend dev server. All API requests are intercepted client-side using `axios-mock-adapter`. No data is persisted to disk, and changes are lost on refresh.
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Additional NPM Scripts

Inside the dashboard project, the following helper scripts are available:

* **`npm run server`**: Runs only the backend JSON server (port `5001`) without launching the frontend.
* **`npm run build`**: Compiles the TypeScript code and bundles the application for production inside the `dist/` directory.
* **`npm run preview`**: Serves the compiled production bundle locally for previewing.

---

## 📂 Project Structure

```text
├── db.json             # Local JSON database (used by json-server)
├── server.js           # Express/json-server backend code (seeds data & handles auth)
├── tsconfig.json       # TypeScript configuration file
├── vite.config.ts      # Vite bundler configuration
├── src/
│   ├── App.tsx         # Main App layout and Router provider
│   ├── main.tsx        # Application entrypoint
│   ├── components/     # Reusable UI components (SearchBar, Form inputs, etc.)
│   ├── pages/          # Layout & Page Views (Dashboard, Login, Employees List)
│   ├── services/       # API clients and Mock Interceptors
│   │   ├── api.ts      # Axios AxiosInstance definition
│   │   └── apiMock.ts  # Client-side Axios Mock Adapter
│   └── utils/          # Helper utils and validators
```

---

## 🔒 Authentication Credentials
If you are running the backend server and prompted to log in:
* **Default Users** are seeded in `db.json` under the `users` list.
* You can also use the **Register** link on the login page to create a new user profile, which will save directly to your database.
