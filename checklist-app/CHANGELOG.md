# Changelog

All notable changes to Learning Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.1] - 2026-02-13

### 🎯 Major Improvements

#### Multi-Device Sync Fixed
- **Refactored progress migration** to happen only once during signup instead of on every login
- Database is now the **single source of truth** for all authenticated users
- Fixed multi-device sync issues - progress now syncs perfectly across all devices

### ✨ Added
- New database migration script `npm run migrate:user` (uses Node.js + .env connection)
- Added `has_migrated_localstorage` flag to `users` table to track migration status
- New API endpoint `/api/auth/migrate-signup-progress` for signup-time migration
- Migration helpers in `SignupModal.jsx` for collecting and migrating localStorage data
- Automatic localStorage cleanup on logout to prevent cross-user data contamination

### 🔄 Changed
- **BREAKING**: Migration logic moved from login flow (`App.jsx`) to signup flow (`SignupModal.jsx`)
- Removed `migrateLocalStorageToDb()` function from `progressSync.js`
- Removed `progress_owner_id` tracking (no longer needed)
- Removed migration `useEffect` from `App.jsx` (90+ lines of code removed)
- Exported `parseStorageKey()` from `progressSync.js` for reuse
- Updated `logout()` in `AuthContext.jsx` to clear all progress from localStorage

### 🐛 Fixed
- **Multi-device sync**: Same account now shows identical progress on all devices
- **Cross-user contamination**: Logout now properly clears all localStorage data
- **Repeated migrations**: Migration only happens once during signup, not on every login
- **Performance**: Removed unnecessary migration checks on login

### 🗑️ Removed
- Removed `previousAuthRef` tracking from `App.jsx`
- Removed `userId` parameter from `saveAllProgress()` (unused)
- Removed complex cross-user contamination checks (handled by logout cleanup)

### 📝 Technical Details

**Migration Flow (New Users):**
1. Guest makes progress → Saved to localStorage
2. User signs up → Account created
3. User verifies email → Migration triggered
4. localStorage data migrated to database
5. localStorage cleared
6. Page reloads with database data

**Login Flow (Existing Users):**
1. User logs in → No migration check
2. Progress loaded from database
3. Changes saved to database
4. Refresh loads from database

**Multi-Device Behavior:**
- Device A: Login → Load from DB → Make changes → Save to DB
- Device B: Login → Load from DB → See same data
- Device A: Refresh → See Device B's changes

---

## [2.4.0] - Previous Version

### Features
- Custom learning lists
- Built-in DSA topics and language checklists
- Examination preparation modules
- User authentication and progress tracking
- Community lists with ratings
- Public list sharing

---

## Migration Guide

### For Existing Users
No action required. Your data is already in the database and will continue to work seamlessly.

### For New Deployments
1. Run `npm run migrate:user` to add the `has_migrated_localstorage` column
2. Restart your server
3. New signups will automatically migrate localStorage data

### Database Migration
```bash
npm run migrate:user
```

This adds the `has_migrated_localstorage` column to the `users` table and marks existing users as already migrated.
