# Project Structure

Overview of the directory structure for Learning's Hub.

```
.
├── checklist-app/              # Main Application Source Code
│   ├── .env                    # Environment variables (not committed)
│   ├── package.json            # Project dependencies and scripts
│   ├── vite.config.js          # Vite configuration
│   │
│   ├── server/                 # Backend (Node.js/Express)
│   │   ├── db.js               # Database connection pool
│   │   ├── index.js            # Entry point for backend
│   │   ├── init-db.js          # Database initialization script
│   │   ├── middleware/         # Express middleware (auth, rateLimiter)
│   │   ├── migrations/         # Database migration scripts
│   │   ├── routes/             # API route definitions
│   │   └── services/           # Business logic services
│   │
│   └── src/                    # Frontend (React)
│       ├── assets/             # Static assets (images, icons)
│       ├── components/         # Reusable UI components
│       ├── config/             # App configuration
│       ├── contexts/           # React Context (Auth, Theme)
│       ├── data/               # Static data (examinations, checklists)
│       ├── hooks/              # Custom React hooks
│       ├── utils/              # Utility functions and API clients
│       ├── App.jsx             # Main application component
│       └── main.jsx            # Entry point
│
├── .github/                    # GitHub configuration
│   ├── ISSUE_TEMPLATE/         # Issue templates for bugs/features
│   ├── workflows/              # CI/CD workflows
│   └── pull_request_template.md # PR description template
│
├── BRANCHING_STRATEGY.md       # Git branching workflow
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
├── COMMIT_CONVENTION.md        # Commit message standards
├── CONTRIBUTING.md             # Guide for contributors
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Main project documentation
```

## Key Directories

### `checklist-app/server`
Contains the Express.js backend logic.
- **`routes/`**: Defines API endpoints.
- **`middleware/`**: Handles request processing like authentication and rate limiting.
- **`db.js`**: Centralized database connection management using `pg` pool.

### `checklist-app/src`
Contains the React frontend application built with Vite.
- **`components/`**: Modular UI components.
- **`contexts/`**: Global state management (Authentication, Theme).
- **`hooks/`**: Custom hooks for shared logic (e.g., `useExaminationProgress`).
- **`utils/`**: Helper functions, API wrappers, and constants.

## Configuration Files

- **`checklist-app/.env`**: Stores environment-specific variables (database URI, API keys).
- **`checklist-app/package.json`**: Manages dependencies and scripts for both frontend and backend.
- **`checklist-app/vite.config.js`**: Configuration for the Vite build tool.
