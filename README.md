# Job-Agent

> AI-powered job search and career management platform built as a full-stack portfolio project.

Job-Agent is a web application designed to centralize the job-search process in one place.

It allows users to discover and save job opportunities, manage applications through a Kanban workflow, upload and analyze their CV with AI, and calculate how well their profile matches available job offers.

The project was developed incrementally, starting with the frontend and evolving into a complete full-stack application with a REST API, relational database, authentication, AI integration and Docker-based infrastructure.

---

## 🚀 Overview

Job-Agent addresses a common problem in the job-search process: information and applications are often scattered across different platforms and documents.

The application brings these workflows together into a single dashboard:

**Discover → Analyze → Save → Apply → Track → Improve**

The project focuses on demonstrating practical full-stack development skills, including frontend architecture, backend development, database design, authentication, API integration, AI integration and deployment-oriented infrastructure.

---

## ✨ Features

### 📊 Dashboard

- Overview of saved jobs and applications
- Application statistics
- Interview and offer tracking
- Recent activity

### 💼 Job Management

- Browse available technology job opportunities
- Filter job listings
- Save interesting opportunities
- Import real job offers through a public employment API
- Avoid duplicate job entries

### 📋 Application Tracking

Kanban workflow for managing applications:

```text
Saved → Applied → Interview → Offer
                         ↘
                        Rejected

Users can move applications between stages and add notes to each application.

📄 CV Management
Upload CVs in PDF, DOC or DOCX format
Store and manage multiple CV versions
Download previously uploaded CVs
Select the current CV
AI-powered CV analysis

🤖 AI Features

The application integrates the Anthropic API to provide:

CV analysis
CV summaries
Strength identification
ATS-oriented analysis
Job/CV compatibility analysis
Match percentage between the candidate profile and job offers

🔐 Authentication & Security
User registration and login
JWT-based authentication
Password hashing with bcrypt
Protected API routes
User ownership validation
Authentication rate limiting
HTTP security headers with Helmet
Environment variable validation
Production-oriented error handling

⚙️ User Preferences
Employment preferences
Application settings
Notification preferences
Theme configuration

🛠️ Tech Stack
Frontend
React 19
TypeScript
Vite
Tailwind CSS
React Router
Lucide React
Backend
Node.js
Express
TypeScript
REST API
Prisma ORM
PostgreSQL
AI
Anthropic API
Claude
Infrastructure
Docker
Docker Compose
Nginx
Security
JWT
bcrypt
Helmet
Rate limiting
Environment validation

🏗️ Architecture

The application follows a separated frontend/backend architecture:

┌─────────────────────────────┐
│          Frontend           │
│                             │
│ React + TypeScript + Vite   │
│ Tailwind CSS + React Router │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           Backend           │
│                             │
│ Node.js + Express + TS      │
│ JWT + Security Middleware   │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ PostgreSQL  │  │ Anthropic API│
│             │  │    Claude    │
└─────────────┘  └──────────────┘

📁 Project Structure
job-agent/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── lib/
│   └── types/
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── config/
│   │
│   └── prisma/
│       └── schema.prisma
│
├── public/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
└── README.md

🖥️ Screenshots

Screenshots showcasing the main application screens will be added here.

Dashboard

Add screenshot here

Job Offers

Add screenshot here

Application Kanban

Add screenshot here

CV & AI Analysis

Add screenshot here

🔄 Main User Flow
Register / Login
       │
       ▼
   Dashboard
       │
       ├───────────────┐
       ▼               ▼
   Job Offers        Profile
       │
       ▼
   Save Job
       │
       ▼
   Application
       │
       ▼
    Kanban
       │
       ├── Applied
       ├── Interview
       ├── Offer
       └── Rejected
       
       +----------------------+
       │
       ▼
     Upload CV
       │
       ▼
   AI Analysis
       │
       ▼
   Job Matching

🔌 API

The backend exposes a REST API organized by domain.

Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Authenticate a user
GET	/api/auth/me	Get authenticated user
Jobs
Method	Endpoint	Description
GET	/api/ofertas	Get available jobs
GET	/api/ofertas/:id	Get job details
POST	/api/ofertas	Create a job
POST	/api/ofertas/importar	Import real job offers
Applications
Method	Endpoint	Description
GET	/api/candidaturas	Get user applications
POST	/api/candidaturas	Save a job as an application
PATCH	/api/candidaturas/:id/estado	Change application status
PATCH	/api/candidaturas/:id	Update application notes
DELETE	/api/candidaturas/:id	Delete an application
CV & AI
Method	Endpoint	Description
GET	/api/cv	Get uploaded CVs
POST	/api/cv	Upload a CV
GET	/api/cv/:id/download	Download a CV
DELETE	/api/cv/:id	Delete a CV
POST	/api/ai/analizar-cv	Analyze a CV with AI
POST	/api/ai/matching	Calculate job/profile matching

🔒 Security

Security was considered throughout the backend implementation.

The application includes:

JWT authentication
bcrypt password hashing
Protected routes
User ownership validation
Authentication rate limiting
Helmet security headers
Environment variable validation
Production error handling
Graceful server shutdown
Database health checks

Sensitive configuration is managed through environment variables and is not committed to the repository.

⚙️ Local Development
Requirements
Node.js 20+
PostgreSQL
npm
1. Clone the repository
git clone https://github.com/GonzaloMAF/job-agent.git
cd job-agent
2. Install frontend dependencies
npm install
3. Configure the backend
cd server
npm install

Create a .env file based on .env.example and configure:

DATABASE_URL=
JWT_SECRET=
PORT=4000
CORS_ORIGIN=http://localhost:5173
ANTHROPIC_API_KEY=
4. Initialize Prisma
npx prisma generate
npx prisma migrate dev

Optional:

npm run db:seed
5. Start the backend
npm run dev

The API will be available at:

http://localhost:4000
6. Start the frontend

From the project root:

npm run dev

The application will be available at:

http://localhost:5173

🐳 Docker

The project includes Docker configuration for the frontend, backend and PostgreSQL database.

From the project root:

docker compose up --build

The environment contains:

Frontend     → Nginx
Backend      → Node.js + Express
Database     → PostgreSQL

🗄️ Database

The application uses PostgreSQL with Prisma ORM.

The main entities include:

User
 ├── Profile
 ├── Preferences
 ├── CVs
 ├── Applications
 ├── Activity
 └── Settings

Job
 └── Applications

The database schema is defined in:

server/prisma/schema.prisma

📈 Development Process

The project was developed incrementally through several stages:

Frontend architecture and UI
Backend REST API
PostgreSQL database
Prisma ORM
JWT authentication
Frontend/API integration
CV upload and management
AI-powered CV analysis
AI job matching
Real job import
Security improvements
Docker infrastructure
Production-oriented configuration

This incremental approach allowed each part of the application to be developed and integrated progressively.

🧠 Technical Highlights

This project demonstrates experience with:

Full-stack web application architecture
React component architecture
TypeScript
REST API design
Relational database design
ORM usage with Prisma
Authentication and authorization
File upload handling
Third-party API integration
AI API integration
Secure environment configuration
Docker and container orchestration
Nginx
Git and GitHub

🚧 Roadmap

Future improvements may include:

Email notifications
More advanced job search filters
Improved profile management
Automated job recommendations
Additional AI-powered career tools
Production deployment
Automated testing and CI/CD

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Gonzalo Manuel Árgueda Fernández

Software Developer · DAM Graduate · Full-Stack & AI Projects

Built as a personal portfolio project to explore modern web development, AI integration and production-oriented application architecture.


**Ojo:** antes de subirlo, hay una cosa que quiero que hagamos después: comprobar que los nombres de los endpoints y algunas tecnologías del README coinciden exactamente con tu código actual. Así evitamos que el README diga que tienes una funcionalidad que finalmente no está implementada o que un endpoint tenga otro nombre.

Para actualizarlo después de pegarlo:

```bash
git add README.md
git commit -m "Improve portfolio README"
git push
