-- Add migration flag to users table
-- This tracks whether a user has already migrated their localStorage data during signup

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS has_migrated_localstorage BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN users.has_migrated_localstorage IS 
'Tracks if user has already migrated localStorage data during signup. Prevents repeated migration attempts on login.';

-- Set existing users to TRUE (they don't need migration)
UPDATE users SET has_migrated_localstorage = TRUE WHERE email_verified = TRUE;
