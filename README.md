<h1 align="center">💼 JobConnect – MERN Stack Job Portal</h1>

<p align="center">
  A production-grade full-stack hiring platform where recruiters post opportunities and candidates discover, filter, and apply — all within a single, role-aware application.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-4DB33D?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-API-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <br/>
  <img src="https://img.shields.io/github/stars/Pruthviraj75/job_portal?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/Pruthviraj75/job_portal?style=for-the-badge" />
  <img src="https://img.shields.io/github/license/Pruthviraj75/job_portal?style=for-the-badge" />
</p>

---

## 📌 Table of Contents

- [About The Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Project Preview](#-project-preview)
- [Features](#-features)
- [Role-Based Access](#-role-based-access)
- [Architecture & How It Works](#️-architecture--how-it-works)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Tech Stack](#️-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Challenges & Learnings](#-challenges--learnings)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📖 About The Project

Hiring workflows today are fragmented — recruiters use spreadsheets, candidates send emails, and application tracking is manual. **JobConnect** is built to address this by providing a unified platform where both sides of the hiring process operate from the same system, each within their own role-scoped experience.

Recruiters can create and manage job listings, set required qualifications, and review incoming applications from their dashboard. Candidates can search and filter open roles, view job details, and apply directly — with their applications tracked per role.

The application is built on the **MERN stack** with JWT-based authentication, role-based access control enforced on both frontend routes and backend API endpoints, and a RESTful API architecture designed for clarity and extensibility.

---

## 🚀 Live Demo

| Resource | Link |
|---|---|
| **Live Application** | [https://job-portal-fjmy.onrender.com](https://job-portal-fjmy.onrender.com/) |
| **GitHub Repository** | [https://github.com/Pruthviraj75/job_portal](https://github.com/Pruthviraj75/job_portal) |
| **Portfolio** | [https://pruthviii.onrender.com](https://pruthviii.onrender.com/) |

---

## 📸 Project Preview

### Home Page
![Homepage](https://i.postimg.cc/RVj7RCLM/homepage.png)

### Job Listings
![Jobs](https://i.postimg.cc/1t2Gj915/jobs-page.png)

<p align="center">
  <img src="screenshots/demo.gif" width="90%" alt="JobConnect Demo" />
</p>

---

## ✨ Features

### 👤 Candidate
- Register and log in securely with JWT authentication
- Browse all active job listings with search and filter support
- View full job details including description, location, and requirements
- Apply to jobs with a single action — applications are tracked per role
- Access a personal dashboard showing application history and status

### 🏢 Recruiter / Admin
- Post new job listings with title, description, location, salary, and requirements
- Edit or delete existing listings at any time
- View a list of all candidates who have applied to each job
- Manage all postings from a dedicated recruiter dashboard

### ⚙️ System
- Role-based access control across all frontend routes and backend endpoints
- JWT tokens issued on login, verified on every protected API call
- RESTful API with consistent response structure
- Responsive UI that works across desktop, tablet, and mobile
- Protected routes redirect unauthenticated users to login automatically

---

## 👥 Role-Based Access

| Feature | Candidate | Recruiter |
|---|:---:|:---:|
| Register / Login | ✅ | ✅ |
| Browse Job Listings | ✅ | ❌ |
| Search & Filter Jobs | ✅ | ❌ |
| Apply for a Job | ✅ | ❌ |
| View Application History | ✅ | ❌ |
| Post a Job | ❌ | ✅ |
| Edit / Delete Job | ❌ | ✅ |
| View Applicants per Job | ❌ | ✅ |
| Role-Specific Dashboard | ✅ | ✅ |

---

## 🏗️ Architecture & How It Works

The application follows a standard three-tier architecture: a React frontend, a Node.js/Express REST API, and a MongoDB database. All communication between frontend and backend goes through Axios over HTTP, with JWT tokens attached to protected requests via an Axios interceptor.

```
┌─────────────────────────────────────────────────┐
│                 REACT FRONTEND                  │
│                                                 │
│  ┌────────────┐   ┌──────────────────────────┐  │
│  │ Auth Pages │   │  Role-Based Dashboards   │  │
│  │ Login/Reg  │   │  Candidate | Recruiter   │  │
│  └─────┬──────┘   └────────────┬─────────────┘  │
│        │                       │                │
│        │   Axios + JWT Header  │                │
└────────┼───────────────────────┼────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────┐
│            NODE.JS / EXPRESS REST API           │
│                                                 │
│  ┌──────────────┐   ┌────────────────────────┐  │
│  │ Auth Routes  │   │  Protected Routes      │  │
│  │ /api/auth    │   │  /api/jobs             │  │
│  │              │   │  /api/applications     │  │
│  └──────┬───────┘   └──────────┬─────────────┘  │
│         │                      │                │
│         │  verifyToken()       │  checkRole()   │
│         │  middleware          │  middleware     │
└─────────┼──────────────────────┼────────────────┘
          │                      │
          ▼                      ▼
┌─────────────────────────────────────────────────┐
│                   MONGODB                       │
│                                                 │
│   Users Collection   — credentials, role        │
│   Jobs Collection    — listings, recruiter ref  │
│   Applications Coll. — jobId, userId, status    │
└─────────────────────────────────────────────────┘
```

### Request Lifecycle

```
1. User logs in → backend issues a signed JWT
         │
         ▼
2. JWT stored in localStorage / state
         │
         ▼
3. Axios interceptor attaches token to every request header
         │
         ▼
4. Backend verifyToken() middleware validates token on protected routes
         │
         ▼
5. checkRole() middleware confirms the user has permission for that route
         │
         ▼
6. Controller queries MongoDB via Mongoose and returns JSON response
         │
         ▼
7. React updates UI state with the response data
```

---

## 📡 API Overview

All API routes are prefixed with `/api`. Protected routes require a valid `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (candidate or recruiter) |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT token |

### Jobs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Fetch all active job listings |
| `GET` | `/api/jobs/:id` | Public | Get details of a single job |
| `POST` | `/api/jobs` | Recruiter | Create a new job listing |
| `PUT` | `/api/jobs/:id` | Recruiter | Update an existing job listing |
| `DELETE` | `/api/jobs/:id` | Recruiter | Delete a job listing |

### Applications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications/:jobId` | Candidate | Apply for a job |
| `GET` | `/api/applications/my` | Candidate | Get current user's applications |
| `GET` | `/api/applications/job/:jobId` | Recruiter | Get all applicants for a job |

---

## 🔒 Security

Security is enforced at both the API and frontend routing layers.

- **JWT Authentication** — Tokens are signed with a secret key on login and verified on every protected request using custom Express middleware. Expired or tampered tokens are rejected immediately.
- **Role-Based Middleware** — A `checkRole()` middleware runs after token verification and confirms the user's role matches the required permission for the route. A candidate attempting to access a recruiter-only endpoint receives a `403 Forbidden` response.
- **Protected Frontend Routes** — React Router guards redirect unauthenticated users to the login page and prevent role mismatches (e.g., a candidate visiting the recruiter dashboard).
- **Password Hashing** — User passwords are hashed with `bcrypt` before storage. Plain-text passwords are never persisted.
- **Input Validation** — API routes validate required fields server-side before any database operation is performed.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js | Component-based UI |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Routing** | React Router v6 | Client-side navigation and protected routes |
| **HTTP Client** | Axios | API communication with interceptor-based auth |
| **Backend** | Node.js + Express.js | REST API and middleware architecture |
| **Database** | MongoDB + Mongoose | Document storage and ODM |
| **Auth** | JWT + bcrypt | Stateless authentication and password hashing |
| **Dev Tools** | Postman, Git | API testing and version control |
| **Deployment** | Render / Vercel | Production hosting |

---

## 🔧 Installation & Setup

### Prerequisites

- Node.js `>= 18`
- MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the Repository

```bash
git clone https://github.com/Pruthviraj75/job_portal.git
cd job_portal
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 5. Run the Application

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## 🧠 Challenges & Learnings

| Challenge | How It Was Solved |
|---|---|
| Enforcing role-based access on both frontend and backend | Built a `checkRole()` Express middleware that runs after JWT verification, and mirrored role checks in React Router using a `ProtectedRoute` wrapper component |
| Preventing candidates from seeing recruiter routes (and vice versa) | React Router's `ProtectedRoute` reads the role from decoded token state and redirects to the appropriate dashboard if a mismatch is detected |
| Keeping application state consistent after login | Stored decoded user info (id, role) in React context on login, persisted to `localStorage` for page refresh, and cleared both on logout |
| Structuring a clean REST API across multiple resource types | Separated routes, controllers, and middleware into distinct folders — each resource (auth, jobs, applications) has its own router file |
| Handling Mongoose relationship queries (jobs ↔ applicants) | Used Mongoose `populate()` to resolve `userId` references in the applications collection, avoiding redundant data storage |

---

## 🔮 Future Improvements

- [ ] **Application status tracking** — allow recruiters to mark applications as Reviewed, Shortlisted, or Rejected
- [ ] **Email notifications** — notify candidates when their application status changes
- [ ] **Resume upload** — candidates attach a PDF resume when applying, stored via cloud storage
- [ ] **Advanced search filters** — filter by location, salary range, job type, and experience level
- [ ] **Pagination** — paginate job listings and applicant lists for scalability
- [ ] **Recruiter company profiles** — dedicated pages per company with all their open roles
- [ ] **Analytics dashboard** — show recruiters view counts, application rates, and conversion metrics per job

---

## 👨‍💻 Author

<div align="center">

**Pruthviraj Gaikwad**

Full-Stack Developer — building real-world applications with the MERN stack

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-0A66C2?style=for-the-badge&logo=google-chrome&logoColor=white)](https://pruthviii.onrender.com/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pruthvi-gaikwad/)
[![GitHub](https://img.shields.io/badge/GitHub-Pruthviraj75-black?style=for-the-badge&logo=github)](https://github.com/Pruthviraj75)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gaikwadpruthviraj01@gmail.com)

</div>

---
