
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

-- CODE THAT I WROTE START
-- Add Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    blog_title TEXT NOT NULL,
    author_name TEXT NOT NULL
);

-- Add Articles table
CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME,
    status TEXT CHECK( status IN ('draft', 'published') ) NOT NULL DEFAULT 'draft',
    reads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0
);

-- Add Comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    commenter_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- CODE THAT I WROTE END
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE -- Delete article along with comments attached
);

-- CODE THAT I WROTE START
-- Insert default data (if necessary here)
INSERT INTO settings (blog_title, author_name) VALUES ('My DnW Blog', 'Chen Junjie');

-- CODE THAT I WROTE END

COMMIT;

