-- Complete Database Schema for DSA Learning Checklist App
-- This script creates all tables, indexes, triggers, and functions

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean initialization)
DROP TABLE IF EXISTS list_ratings CASCADE;
DROP TABLE IF EXISTS custom_progress CASCADE;
DROP TABLE IF EXISTS custom_resources CASCADE;
DROP TABLE IF EXISTS custom_topics CASCADE;
DROP TABLE IF EXISTS custom_sections CASCADE;
DROP TABLE IF EXISTS custom_lists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_list_rating() CASCADE;
DROP FUNCTION IF EXISTS update_copy_count() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_otp VARCHAR(6),
    email_otp_expires TIMESTAMP,
    email_otp_attempts INT DEFAULT 0,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CUSTOM LISTS TABLE
-- ============================================
CREATE TABLE custom_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '📚',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    rating_count INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    copy_count INTEGER DEFAULT 0,
    original_list_id UUID REFERENCES custom_lists(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CUSTOM SECTIONS TABLE
-- ============================================
CREATE TABLE custom_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(50) DEFAULT '📁',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CUSTOM TOPICS TABLE
-- ============================================
CREATE TABLE custom_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES custom_sections(id) ON DELETE CASCADE,
    parent_topic_id UUID REFERENCES custom_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CUSTOM RESOURCES TABLE
-- ============================================
CREATE TABLE custom_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES custom_topics(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('video', 'note', 'link', 'practice')),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    platform VARCHAR(100) DEFAULT 'Custom',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CUSTOM PROGRESS TABLE
-- ============================================
CREATE TABLE custom_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES custom_topics(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES custom_resources(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, list_id, topic_id, resource_id)
);

-- ============================================
-- LIST RATINGS TABLE
-- ============================================
CREATE TABLE list_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES custom_lists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(list_id, user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Custom lists indexes
CREATE INDEX idx_custom_lists_user_id ON custom_lists(user_id);
CREATE INDEX idx_custom_lists_public ON custom_lists(is_public);
CREATE INDEX idx_custom_lists_rating ON custom_lists(rating_count, rating_sum);
CREATE INDEX idx_custom_lists_original ON custom_lists(original_list_id);

-- Sections indexes
CREATE INDEX idx_custom_sections_list_id ON custom_sections(list_id);
CREATE INDEX idx_custom_sections_order ON custom_sections(list_id, order_index);

-- Topics indexes
CREATE INDEX idx_custom_topics_section_id ON custom_topics(section_id);
CREATE INDEX idx_custom_topics_parent_id ON custom_topics(parent_topic_id);
CREATE INDEX idx_custom_topics_order ON custom_topics(section_id, order_index);

-- Resources indexes
CREATE INDEX idx_custom_resources_topic_id ON custom_resources(topic_id);
CREATE INDEX idx_custom_resources_order ON custom_resources(topic_id, order_index);

-- Progress indexes
CREATE INDEX idx_custom_progress_user_list ON custom_progress(user_id, list_id);
CREATE INDEX idx_custom_progress_topic ON custom_progress(topic_id);
CREATE INDEX idx_custom_progress_resource ON custom_progress(resource_id);
CREATE INDEX idx_custom_progress_user_id ON custom_progress(user_id);
CREATE INDEX idx_custom_progress_topic_user ON custom_progress(topic_id, user_id);

-- Ratings indexes
CREATE INDEX idx_list_ratings_list_id ON list_ratings(list_id);
CREATE INDEX idx_list_ratings_user_id ON list_ratings(user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Function to update list rating counts
CREATE OR REPLACE FUNCTION update_list_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE custom_lists 
        SET rating_count = rating_count + 1,
            rating_sum = rating_sum + NEW.rating
        WHERE id = NEW.list_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE custom_lists 
        SET rating_sum = rating_sum - OLD.rating + NEW.rating
        WHERE id = NEW.list_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE custom_lists 
        SET rating_count = rating_count - 1,
            rating_sum = rating_sum - OLD.rating
        WHERE id = OLD.list_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update copy count
CREATE OR REPLACE FUNCTION update_copy_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.original_list_id IS NOT NULL THEN
        UPDATE custom_lists 
        SET copy_count = copy_count + 1
        WHERE id = NEW.original_list_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at on all tables
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_lists_updated_at 
BEFORE UPDATE ON custom_lists
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_sections_updated_at 
BEFORE UPDATE ON custom_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_topics_updated_at 
BEFORE UPDATE ON custom_topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_resources_updated_at 
BEFORE UPDATE ON custom_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_progress_updated_at 
BEFORE UPDATE ON custom_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_list_ratings_updated_at 
BEFORE UPDATE ON list_ratings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rating updates
CREATE TRIGGER rating_update_trigger
AFTER INSERT OR UPDATE OR DELETE ON list_ratings
FOR EACH ROW EXECUTE FUNCTION update_list_rating();

-- Trigger for copy count
CREATE TRIGGER copy_count_trigger
AFTER INSERT ON custom_lists
FOR EACH ROW EXECUTE FUNCTION update_copy_count();

COMMIT;

-- Display success message
SELECT 'Database initialized successfully! ✓' as status;
