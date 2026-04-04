-- =============================================
-- APSIT S.A.F.E - Seed Data (Categories Only)
-- Users, Admins, Items are loaded via DataSeeder.java
-- =============================================

-- Default Categories
INSERT IGNORE INTO categories (id, name, icon, item_count) VALUES
(1, 'Electronics', '💻', 0),
(2, 'ID Cards', '🪪', 0),
(3, 'Books/Notes', '📚', 0),
(4, 'Bags', '🎒', 0),
(5, 'Accessories', '⌚', 0),
(6, 'Keys', '🔑', 0),
(7, 'Others', '📦', 0);
