# devpluse-b7a3 - Issue Tracker api

DevPulse is a robust, lightweight, and scalable backend RESTful API built with a modular software development approach. It allows engineering teams to track application bugs and feature requests, featuring role-based authorization for strict system management.

---

## Live Applicatio
- **Live Server URL:** ``
`https://devpulse-webapp.vercel.app/`
---

## Key Features
- **Modular Architecture:** Highly structured codebase utilizing the domain-driven modular framework pattern.
- **Robust Authentication:** Secure member signup and JWT-based authentication (token payload carries `id`, `name`, and `role`).
- **Role-Based Access Control (RBAC):** Restrictive routes allowing only `maintainer` accounts to manage issue lifecycles.
- **Advanced Data Recovery:** Efficient public endpoint for tracking and filtering active items by type, status, and partial text match without complex table joins.
- **Centralized Error handling:** Custom error layer providing clear, standardized JSON feedback for database constraints, validation errors, and missing assets.

---

## Tech Stack
- **Language:** TypeScript
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Cloud hosted via Neon DB)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## Database Schema Summary
The system operates on two core relational tables utilizing primary/foreign key connections.

### 1. `users` Table
| Column Name | Data Type | Constraints |
| :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY |
| `name` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL |
| `password` | VARCHAR(255) | NOT NULL |
| `role` | VARCHAR(20) | NOT NULL (Default: 'contributor') |

### 2. `issues` Table
| Column Name | Data Type | Constraints |
| :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY |
| `title` | VARCHAR(150) | NOT NULL |
| `description`| TEXT | NOT NULL (Min 20 characters) |
| `type` | VARCHAR(50) | 'bug' \| 'feature_request' |
| `status` | VARCHAR(20) | 'open' \| 'in_progress' \| 'resolved' (Default: 'open') |
| `reporter_id`| INT | FOREIGN KEY REFERENCES `users(id)` |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Local Setup Steps

Follow these straight-forward steps to get the server running on your local machine:

1. **Clone the Repository:**
```bash
   git clone https://github.com/milonroy26/devpulse-b7a2.git
   cd devpulse-b7a2

Install Project Dependencies:

Bash -> npm install

Configure Environment Variables:
Create a .env file in the root folder following parameters:

Code snippet
   PORT=5000
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_ACCESS_SECRET=your_jwt_strong_secret_key
   JWT_ACCESS_EXPIRES_IN=1d


Bash -> npm run dev ```

* Build for Production:
```bash
     npm run build
     npm start
     ```
---

## API Endpoints Documentation

All requests interact with the `/api` root path suffix.

### Authentication Module (`/api/auth`)
| Method | Endpoint | Access | Description |
| **POST** | `/auth/signup` | Public | Registers a new member to the workspace. |
| **POST** | `/auth/login` | Public | Validates login credentials and returns a bare JWT. |

### Issue Tracking Module (`/api/issues`)
| Method | Endpoint | Access | Description |
| **POST** | `/issues` | Authenticated | Creates a new issue logged against the token identity. |
| **GET** | `/issues` | Public | Retrieves all logs. Supports queries: `?status=`, `?type=`, `?search=` |
| **GET** | `/issues/:id` | Public | Retrieves comprehensive metadata for a specific issue by ID. |
| **PATCH**| `/issues/:id/status` | Maintainer Only | Updates operational state (`open`, `in_progress`, `resolved`). |
| **DELETE**| `/issues/:id` | Maintainer Only | Permanently removes an explicit report entry. |
---

## Standard Error Response Format
When processing errors occur, the service consistently communicates through this precise template structure:
```json
{
  "success": false,
  "errors": "Informative error detail statement context provided here."
}