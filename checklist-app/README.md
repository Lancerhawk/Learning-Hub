# Learning Hub

A comprehensive learning platform for DSA, programming languages, and custom learning paths with progress tracking, community lists, and authentication.

## 🎯 Features

- **Built-in Learning Paths**: DSA topics, programming languages (JavaScript, Python, Java, C++, Go, Rust), and examination preparation (GATE-CS, GATE-DA, GATE-EC)
- **Custom Lists**: Create your own learning checklists with sections, topics, and resources
- **Progress Tracking**: Track your learning progress across all devices
- **Multi-Device Sync**: Seamless progress synchronization across all your devices
- **Community Lists**: Share your lists publicly and discover lists from other learners
- **User Authentication**: Secure email-based authentication with verification
- **Ratings & Reviews**: Rate and review community lists

## 🚀 Version 2.5.1 - Multi-Device Sync Update

### What's New
- **Perfect Multi-Device Sync**: Your progress now syncs flawlessly across all devices
- **Smarter Migration**: Progress migration happens once during signup, not on every login
- **Cleaner Logout**: localStorage is completely cleared on logout
- **Better Performance**: Faster login with no migration checks

### How It Works
- **Database as Single Source**: All authenticated users' progress is stored in the database
- **Signup Migration**: When you create an account, any guest progress is automatically migrated
- **Real-time Sync**: Changes on one device appear on all devices after refresh

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lancerhawk/Learnings-Hub.git
   cd checklist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/learning_hub
   JWT_SECRET=your-secret-key-here
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Run database migrations** (for v2.5.1)
   ```bash
   npm run migrate:user
   ```

6. **Start the development server**
   ```bash
   npm run dev    # Frontend (Vite)
   npm run server # Backend (Express)
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server

### Database
- `npm run init-db` - Initialize database with complete schema
- `npm run reset-db` - Reset database (⚠️ deletes all data)
- `npm run migrate:db` - Run database migrations
- `npm run migrate:user` - Add migration flag to users table (v2.5.1)

### Build & Deploy
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📚 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Express** - Web framework
- **PostgreSQL** - Database
- **node-postgres (pg)** - Database client
- **JWT** - Authentication
- **Nodemailer** - Email verification
- **bcrypt** - Password hashing

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and authentication
- `custom_lists` - User-created learning lists
- `custom_sections` - Sections within lists
- `custom_topics` - Topics within sections
- `custom_resources` - Learning resources
- `custom_progress` - Progress tracking for custom lists
- `builtin_progress` - Progress tracking for built-in checklists
- `list_ratings` - Community list ratings

## 🔐 Authentication Flow

1. **Signup**: User creates account with email
2. **Email Verification**: OTP sent to email
3. **Verification**: User enters OTP
4. **Migration** (v2.5.1): Guest progress automatically migrated to database
5. **Login**: JWT token issued
6. **Access**: Protected routes accessible with valid token

## 📱 Multi-Device Sync (v2.5.1)

### How It Works
1. **Login on Device A**: Progress loaded from database
2. **Make changes**: Saved to database
3. **Login on Device B**: Same progress loaded from database
4. **Make changes on Device B**: Saved to database
5. **Refresh Device A**: See Device B's changes

### Migration Behavior
- **New Users**: Guest progress migrated during signup
- **Existing Users**: No migration needed, already using database
- **Logout**: localStorage cleared to prevent cross-user data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Lancerhawk**
- GitHub: [@Lancerhawk](https://github.com/Lancerhawk)

## 🐛 Bug Reports

If you encounter any issues, please report them on the [GitHub Issues](https://github.com/Lancerhawk/Learnings-Hub/issues) page.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

---

**Current Version**: 2.5.1  
**Last Updated**: February 13, 2026
