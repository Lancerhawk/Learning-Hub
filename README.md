# DSA Learning Checklist App

A comprehensive full-stack web application designed to help developers track their progress in learning Data Structures & Algorithms (DSA) and programming languages. Features include custom list creation, public list sharing, progress tracking, and a community-driven learning platform.

## Features

### Core Features
- **Progress Tracking** - Track your learning progress across multiple programming languages and DSA topics with intelligent data synchronization
- **Examination System** - Dedicated system for competitive exam preparation (GATE, etc.) with auto-check functionality
- **Custom Lists** - Create personalized learning checklists with sections, topics, and resources
- **Public Lists** - Share your learning lists with the community and explore lists created by others
- **Rating System** - Rate and review public lists to help others find quality content
- **List Copying** - Fork public lists and customize them for your own learning journey
- **Version History** - Track lineage of copied lists back to their original creators

### User Features
- **Authentication** - Secure user registration and login with JWT tokens and email verification
- **Password Reset** - Email-based password recovery with SendGrid integration
- **User Profiles** - Track your contributions and learning progress
- **Resource Management** - Add videos, practice problems, notes, and links to topics

### Technical Features
- **Rate Limiting** - IP-based rate limiting to prevent abuse (20 requests/minute for progress endpoints)
- **Batch Operations** - Optimized API calls with 94% reduction in requests (17 requests to 1)
- **Data Ownership Tracking** - Prevents cross-user data contamination with user ID validation
- **Modern UI** - Terminal/hacker-themed design with smooth animations
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Search & Filter** - Find lists by title, sort by rating, copies, or date

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Vite + TailwindCSS]
        A1[Components]
        A2[Context API<br/>Auth State]
        A3[React Router]
        A --> A1
        A --> A2
        A --> A3
    end

    subgraph "Server Layer"
        B[Express.js Server]
        B1[Authentication<br/>Middleware]
        B2[Rate Limiting<br/>Middleware]
        B3[API Routes]
        B --> B1
        B --> B2
        B --> B3
    end

    subgraph "API Routes"
        C1[Auth Routes<br/>Login/Signup/OTP]
        C2[Password Reset<br/>Routes]
        C3[Custom Lists<br/>CRUD Operations]
        C4[Public Lists<br/>Routes]
        C5[Custom Progress<br/>Tracking]
        C6[Builtin Progress<br/>Batch Operations]
        B3 --> C1
        B3 --> C2
        B3 --> C3
        B3 --> C4
        B3 --> C5
        B3 --> C6
    end

    subgraph "Database Layer"
        D[(PostgreSQL)]
        D1[Users Table]
        D2[Custom Lists]
        D3[Sections/Topics]
        D4[Resources]
        D5[Custom Progress]
        D6[Builtin Progress]
        D7[Ratings]
        D --> D1
        D --> D2
        D --> D3
        D --> D4
        D --> D5
        D --> D6
        D --> D7
    end

    subgraph "External Services"
        E[SendGrid<br/>Email Service]
    end

    A <--> |HTTP/JSON| B
    B <--> |SQL Queries| D
    C2 --> |Send Emails| E

    style A fill:#22c55e,stroke:#16a34a,color:#000
    style B fill:#0f172a,stroke:#22c55e,color:#22c55e
    style D fill:#1e293b,stroke:#22c55e,color:#22c55e
    style E fill:#334155,stroke:#22c55e,color:#22c55e
```

### Technology Stack

#### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **SendGrid** - Email service
- **Express Rate Limit** - API rate limiting

#### Database Schema
```mermaid
erDiagram
    USERS ||--o{ CUSTOM_LISTS : creates
    USERS ||--o{ LIST_RATINGS : rates
    USERS ||--o{ CUSTOM_PROGRESS : tracks
    USERS ||--o{ BUILTIN_PROGRESS : tracks
    CUSTOM_LISTS ||--o{ CUSTOM_SECTIONS : contains
    CUSTOM_LISTS ||--o{ LIST_RATINGS : receives
    CUSTOM_LISTS ||--o{ CUSTOM_LISTS : copies
    CUSTOM_SECTIONS ||--o{ CUSTOM_TOPICS : contains
    CUSTOM_TOPICS ||--o{ CUSTOM_RESOURCES : contains
    CUSTOM_TOPICS ||--o{ CUSTOM_PROGRESS : tracks

    USERS {
        uuid id PK
        string username UK
        string email UK
        string password_hash
        boolean email_verified
        string verification_otp
        timestamp otp_expires_at
        string reset_token
        timestamp reset_token_expires
        timestamp created_at
    }

    CUSTOM_LISTS {
        uuid id PK
        string title
        text description
        string icon
        uuid user_id FK
        boolean is_public
        int rating_count
        int rating_sum
        int copy_count
        uuid original_list_id FK
        timestamp created_at
        timestamp updated_at
    }

    CUSTOM_SECTIONS {
        uuid id PK
        uuid list_id FK
        string title
        string icon
        int order_index
        timestamp created_at
    }

    CUSTOM_TOPICS {
        uuid id PK
        uuid section_id FK
        uuid parent_topic_id FK
        string title
        int order_index
        timestamp created_at
    }

    CUSTOM_RESOURCES {
        uuid id PK
        uuid topic_id FK
        string type
        string title
        string url
        string platform
        int order_index
        timestamp created_at
    }

    CUSTOM_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid list_id FK
        uuid topic_id FK
        uuid resource_id FK
        boolean completed
        timestamp completed_at
        timestamp created_at
    }

    BUILTIN_PROGRESS {
        uuid id PK
        uuid user_id FK
        string checklist_type
        string checklist_id
        string item_key
        boolean completed
        timestamp completed_at
        timestamp created_at
    }

    LIST_RATINGS {
        uuid id PK
        uuid list_id FK
        uuid user_id FK
        int rating
        timestamp created_at
    }
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**
- **SendGrid Account** (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd checklist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/dsa_checklist

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-here

   # SendGrid Email Service
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=your-verified-email@example.com

   # Frontend URL (for password reset emails)
   FRONTEND_URL=http://localhost:5173

   # Server Port
   PORT=3001
   ```

4. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb dsa_checklist
   ```

   Initialize the database schema:
   ```bash
   npm run init-db
   ```

5. **Start the development servers**
   
   In one terminal, start the backend:
   ```bash
   npm run server
   ```

   In another terminal, start the frontend:
   ```bash
   npm run dev
   ```

   Or run both concurrently:
   ```bash
   npm run dev:all
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001/api`
   - Health Check: `http://localhost:3001/api/health`

### Database Management

**Reset Database** (Warning: Deletes all data):
```bash
npm run reset-db
```

**Initialize Database**:
```bash
npm run init-db
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/signup` | Register new user | 10 req/10min |
| POST | `/api/auth/login` | Login user | 10 req/10min |
| GET | `/api/auth/me` | Get current user | - |
| POST | `/api/auth/resend-otp` | Resend verification OTP | 5 req/10min |

### Password Reset Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/password/forgot-password` | Request password reset | 5 req/10min |
| POST | `/api/password/reset-password` | Reset password with token | - |
| GET | `/api/password/verify-reset-token/:token` | Verify reset token | - |

### Progress Tracking Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/builtin-progress/load-all` | Load all progress (batch) | 20 req/min |
| POST | `/api/builtin-progress/batch-all` | Save all progress (batch) | 20 req/min |
| GET | `/api/builtin-progress/:type/:id` | Get specific checklist progress | - |

### Custom Lists Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/custom-lists` | Get user's lists | - |
| GET | `/api/custom-lists/:id` | Get list details | - |
| POST | `/api/custom-lists` | Create new list | 10 req/30min |
| PUT | `/api/custom-lists/:id` | Update list | - |
| DELETE | `/api/custom-lists/:id` | Delete list | - |

### Public Lists Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public-lists` | Get all public lists |
| GET | `/api/public-lists/:id` | Get public list details |
| POST | `/api/public-lists/:id/copy` | Copy a public list |
| POST | `/api/public-lists/:id/rate` | Rate a public list |
| GET | `/api/public-lists/:id/lineage` | Get list version history |

## Security Features

- **JWT Authentication** - Secure token-based authentication with email verification
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - IP-based request throttling with endpoint-specific limits
- **SQL Injection Protection** - Parameterized queries
- **CORS** - Configured cross-origin resource sharing
- **Environment Variables** - Sensitive data protection
- **Data Ownership Validation** - Prevents cross-user data contamination

## Performance Optimizations

- **Batch Operations** - Reduced API calls by 94% (17 requests to 1)
- **Single Database Query** - Optimized progress loading with grouped queries
- **Debounced Saves** - 500ms debounce to prevent excessive save operations
- **Efficient Migration** - Smart data migration with ownership validation

## License

MIT License

Copyright (c) 2026 Arin Jain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

**Arin Jain**

## Acknowledgments

- Terminal/hacker theme inspired by classic command-line interfaces
- Icons provided by Lucide React
- Email service powered by SendGrid

## Additional Documentation

- [Database Setup Guide](server/DATABASE_SETUP.md)
- [Forgot Password Feature](FORGOT_PASSWORD_FEATURE.md)
- [Rate Limiting Documentation](RATE_LIMITING.md)
- [Changelog](CHANGELOG.md)

---

Made with dedication by Arin Jain
