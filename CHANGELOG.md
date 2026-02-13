# Learning's Hub - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.1] - 2026-02-13

### Added
- **Signup-Only Migration System**: Progress migration now occurs once during account creation instead of on every login
  - New API endpoint `/api/auth/migrate-signup-progress` for handling signup-time migration
  - Migration helpers in `SignupModal.jsx` for collecting and migrating localStorage data
  - Database migration script `npm run migrate:user` (uses Node.js + .env connection)
- **Migration Tracking**: Added `has_migrated_localstorage` boolean column to `users` table
  - Prevents duplicate migrations for the same user
  - Existing users automatically marked as migrated during database migration
- **Logout Cleanup**: Automatic localStorage clearing on logout
  - Removes all `*_progress` keys from localStorage
  - Removes `progress_owner_id` tracking key
  - Prevents cross-user data contamination on shared devices

### Fixed
- **Multi-Device Sync**: Database is now the single source of truth for authenticated users
  - Same account shows identical progress across all devices
  - Changes on one device appear on all devices after refresh
  - Eliminated localStorage inconsistencies between devices
- **Cross-User Data Contamination**: Logout properly clears all progress data from localStorage
  - No more stale data when different users log in on same device
  - Clean state for each new user session
- **Repeated Migrations**: Migration only happens once during signup verification
  - Removed unnecessary migration checks on every login
  - Eliminated migration-related performance overhead
- **Performance**: Faster login experience with no migration checks
  - Removed 90+ lines of migration logic from login flow
  - Direct database loading for authenticated users

### Changed
- **Migration Architecture**: Moved migration logic from login flow to signup flow
  - Removed migration `useEffect` from `App.jsx` (90+ lines)
  - Added migration logic to `SignupModal.jsx` `handleVerified()` function
  - Migration now triggered by email verification, not login
- **Code Cleanup**: Removed obsolete migration-related code
  - Removed `migrateLocalStorageToDb()` function from `progressSync.js`
  - Removed `progress_owner_id` tracking from `saveAllProgress()`
  - Removed `previousAuthRef` tracking from `App.jsx`
  - Removed `userId` parameter from `saveAllProgress()` (unused)
- **Function Exports**: Exported `parseStorageKey()` from `progressSync.js` for reuse in `SignupModal.jsx`
- **Logout Behavior**: Updated `logout()` in `AuthContext.jsx` to clear all progress from localStorage

### Removed
- **Login Migration Logic**: No more migration checks during login process
  - Removed complex cross-user contamination checks (handled by logout cleanup)
  - Removed ownership validation logic (no longer needed)
  - Removed migration completion tracking

---

## [2.5.0] - 2026-02-12

### Added
- **Builtin Progress Table**: New dedicated database table for built-in checklists (languages, DSA topics, examinations)
  - Separate from custom list progress tracking
  - Optimized schema: `user_id`, `checklist_type`, `checklist_id`, `item_key`, `completed`, `completed_at`
  - Supports multiple checklist types: `language_dsa`, `language_dev`, `dsa_topics`, `examination`
- **Batch Progress API Endpoints**: Single-request operations for all progress data
  - `GET /api/builtin-progress/load-all` - Load all user progress in one request
  - `POST /api/builtin-progress/batch-all` - Save all progress in one request
  - Reduced API calls from 17 individual requests to 1 batch request (94% reduction)
- **Progress Rate Limiting**: Endpoint-specific rate limiting for progress operations
  - Load endpoint: 20 requests per minute per IP
  - Save endpoint: 20 requests per minute per IP
  - Clear error messages with retry-after information (HTTP 429)
  - Prevents API abuse and ensures fair usage
- **User ID Ownership Tracking**: Progress data includes user ID to prevent cross-user contamination
  - Stores `progress_owner_id` in localStorage when saving progress
  - Validates ownership before migration to prevent User A's data migrating to User B's account
  - Automatically clears other users' data when detected during login

### Fixed
- **Migration Race Condition**: Fixed critical issue where progress would disappear after login and page reload
  - Migration now completes before loading progress from database
  - Removed one-time migration flag to support logout/login cycles
  - Added ownership check to migrate only user's own data or guest data
  - Progress loads correctly after migration completes
- **Cross-User Data Contamination**: Prevented localStorage data from one user being migrated to another user's account
  - Clears other users' data when detected during login
  - Only migrates data that belongs to current user or is guest data
  - Ensures data integrity across user sessions

### Changed
- **Batch Progress Loading**: Optimized from 17 GET requests to 1 single batch request
  - Groups all progress by checklist type and ID
  - Single database query with proper indexing
  - 94% reduction in network requests
- **Batch Progress Saving**: Optimized from 17+ POST requests to 1 single batch request
  - Atomic transactions ensure data consistency
  - Delete and re-insert strategy for clean state
  - Handles multiple checklist types in one operation
- **Migration Logic**: Now checks for actual localStorage data on every login instead of using one-time flag
  - Supports multiple login/logout cycles
  - Validates data ownership before migration
  - Clears stale data from other users

### Performance
- **94% API Call Reduction**: From 17 requests to 1 for both loading and saving
- **Faster Page Load**: Single database query instead of multiple sequential queries
- **Improved Database Performance**: Batch operations with proper indexing and transactions
- **Reduced Network Latency**: One round-trip instead of 17 for progress operations


---

## [2.4.0] - 2026-02-11


### Added
- **Dedicated Examination System**: Completely rebuilt examination checkbox and progress tracking in separate files
  - New custom hook: `useExaminationProgress.js` for examination state management
  - New utility: `examinationProgressCalculator.js` for accurate progress calculations
- **Auto-Check Parent Topics**: Automatically checks parent topic when ALL resources (videos, practice, references) are completed
- **Auto-Uncheck Parent Topics**: Automatically unchecks parent topic when ANY resource is unchecked
- **Improved Progress Tracking**: Accurate calculation counting completed topics (not individual resources)

### Fixed
- Removed subtopic handling from checkbox logic (subtopics are not checkable in UI)
- Fixed localStorage key usage for examination progress
- Fixed examination routes and imports
- Clean separation: Zero interference with DSA/language checklist logic

---

## [2.3.1] - 2026-02-05

### Changed
- **Email Template Improvements**: Enhanced OTP verification email structure for better deliverability
- Removed emoji from email subject line to reduce spam filtering
- Added proper sender name and reply-to headers
- Improved HTML email structure with proper meta tags and language attributes
- Enhanced plain text email version for better compatibility
- Added email categories and custom headers for tracking

### Fixed
- Improved email deliverability to reduce spam folder placement

## [2.3.0] - 2026-02-05

### Added
- **Email Verification Enforcement**: Users must verify their email to access custom lists and explore features
- **Verification Banner**: Yellow warning banner for unverified users with "Resend OTP" functionality
- **OTP Entry Modal**: Modal dialog for users to enter verification code after resending OTP
- **Protected Routes**: Custom lists and explore routes now require email verification
- **Visual Indicators**: Lock icons in sidebar for features requiring verification
- **Real-time State Updates**: User verification status updates immediately without logout/login

### Changed
- Updated login endpoint to return `emailVerified` status
- Enhanced AuthContext to track email verification state
- Improved ProtectedRoute component with `requireVerification` prop
- Updated Sidebar with verification requirement indicators

### Security
- Enforced email verification for user-generated content features
- Improved account security by validating email ownership

---

## [v2.2.0] - 2026-02-05

### Added
- **Changelog System**: Implemented comprehensive version history tracking with floating button UI
- **Version History Modal**: Beautiful terminal-themed modal displaying all updates with color-coded categories
- **CHANGELOG.md**: Complete documentation of all versions from GitHub commit history

### Changed
- **Package Identity**: Updated package.json to reflect the platform as a "Learning Hub" rather than just a DSA checklist
- **Package Version**: Bumped to v2.2.0 with proper metadata (description, author, license)

---

## [v2.1.0] - 2026-02-05

### Fixed
- Fixed dropdown arrow icon positioning in filter buttons for better visual alignment

---

## [v2.0.0] - 2026-02-03

### Changed
- **Dashboard Metrics Update**: Changed homepage dashboard from programming language completion tracking to DSA completion tracking for better focus on core learning objectives

### Fixed
- Fixed sidebar layout issues
- Fixed localStorage checking logic on homepage for accurate progress tracking

---

## [v1.9.0] - 2026-02-01

### Added
- **OTP Verification System**: Implemented email OTP verification for signup process
- **Email Authenticity**: Added email validation system to ensure genuine user registrations

### Changed
- Moved README to root directory for better project structure

### Fixed
- Fixed icon selector design in frontend for improved user experience
- Fixed password validation logic to ensure stronger security requirements
- Fixed Vercel deployment configuration

### Legal
- Added MIT License file to the project

---

## [v1.8.0] - 2026-01-31

### Added
- **Custom Lists Feature**: Users can now create, edit, and manage their own custom learning lists
- **Explore Page**: Browse and discover public learning lists created by the community
- **Authentication System**: Complete login/signup system with user accounts
- **Deployment Ready**: Application fully configured and ready for production deployment

---

## [v1.7.0] - 2026-01-23

### Added
- **Custom Scrollbar Design**: Implemented themed scrollbar matching the terminal aesthetic
- **Custom Cursor Design**: Added unique cursor design for enhanced visual experience
- **Custom Click Sound**: Interactive audio feedback on user interactions
- **Custom Selection Theme**: Styled text selection to match the terminal theme
- **Logo & Branding**: Added application logo and updated website heading

### Changed
- **Enhanced DSA Content**: Added more DSA topics and practice questions across multiple platforms
- **Topic Organization**: Removed redundancy from C++ topics and improved naming consistency

### Fixed
- Fixed scrolling behavior - pages now scroll from top instead of middle
- Fixed topic names for better clarity and consistency

---

## [v1.6.0] - 2026-01-22

### Added
- **Typing Animations**: Implemented smooth typing animations for hero sections
- **Real Language Logos**: Replaced emoji icons with official programming language logos from CDN
- **Improved Sidebar Design**: Enhanced sidebar with better navigation and visual hierarchy

### Changed
- Overall UI/UX improvements for a more polished and professional appearance

---

## [v1.0.0] - 2026-01-22

### Added
- **Initial Release**: DSA Learning Checklist Application
- **Multi-Language Support**: Checklists for Java, JavaScript, Python, C++, and more
- **DSA Topics**: Comprehensive Data Structures and Algorithms topics with resources
- **Progress Tracking**: LocalStorage-based progress tracking for all topics
- **Responsive Design**: Mobile-first responsive design with terminal theme
- **Video Tutorials**: Curated video resources for each topic
- **Practice Problems**: Links to practice problems on LeetCode, HackerRank, GeeksForGeeks, and CodeForces
- **Dark Terminal Theme**: Cyberpunk-inspired terminal aesthetic with green accents
- **Expandable Sections**: Collapsible sections for better content organization

---

## Version Format

Versions follow Semantic Versioning (SemVer):
- **Major** (X.0.0): Breaking changes or major feature additions
- **Minor** (x.X.0): New features, backward compatible
- **Patch** (x.x.X): Bug fixes and minor improvements
