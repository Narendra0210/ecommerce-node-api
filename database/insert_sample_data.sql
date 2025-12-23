-- ============================================
-- INSERT CATEGORIES FOR BANGLE STORE
-- ============================================
-- Since you already have 4 categories, these are for bangle store
-- You can modify the category names as needed

INSERT INTO categories (category_name, is_active, created_at) VALUES
('Gold Bangles', 1, CURRENT_TIMESTAMP),
('Silver Bangles', 1, CURRENT_TIMESTAMP),
('Designer Bangles', 1, CURRENT_TIMESTAMP),
('Traditional Bangles', 1, CURRENT_TIMESTAMP);

-- Additional categories for bangle store (if needed):
-- INSERT INTO categories (category_name, is_active, created_at) VALUES
-- ('Diamond Bangles', 1, CURRENT_TIMESTAMP),
-- ('Antique Bangles', 1, CURRENT_TIMESTAMP),
-- ('Bridal Bangles', 1, CURRENT_TIMESTAMP),
-- ('Kids Bangles', 1, CURRENT_TIMESTAMP);

-- ============================================
-- INSERT ITEMS FOR BANGLE STORE
-- ============================================
-- Note: Replace category_id values (1, 2, 3, 4) with your actual category IDs
-- You can check your category IDs with: SELECT category_id, category_name FROM categories;

-- Items for Category 1 (Gold Bangles)
INSERT INTO items (category_id, item_name, price, is_active, created_at) VALUES
(1, '22K Gold Traditional Bangle', 45000.00, 1, CURRENT_TIMESTAMP),
(1, '24K Gold Plain Bangle', 55000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Kada Bangle', 38000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Designer Bangle', 52000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Antique Bangle', 48000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Bridal Bangle Set', 95000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Temple Bangle', 42000.00, 1, CURRENT_TIMESTAMP),
(1, '22K Gold Twisted Bangle', 39000.00, 1, CURRENT_TIMESTAMP);

-- Items for Category 2 (Silver Bangles)
INSERT INTO items (category_id, item_name, price, is_active, created_at) VALUES
(2, '925 Silver Traditional Bangle', 2500.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Designer Bangle', 3200.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Kada Bangle', 2200.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Antique Bangle', 2800.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Oxidized Bangle', 2100.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Bridal Bangle Set', 8500.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Temple Bangle', 2400.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Twisted Bangle', 2300.00, 1, CURRENT_TIMESTAMP),
(2, '925 Silver Meenakari Bangle', 3500.00, 1, CURRENT_TIMESTAMP);

-- Items for Category 3 (Designer Bangles)
INSERT INTO items (category_id, item_name, price, is_active, created_at) VALUES
(3, 'Kundan Designer Bangle', 8500.00, 1, CURRENT_TIMESTAMP),
(3, 'Polki Designer Bangle', 12000.00, 1, CURRENT_TIMESTAMP),
(3, 'Pearl Designer Bangle', 6500.00, 1, CURRENT_TIMESTAMP),
(3, 'Diamond Designer Bangle', 45000.00, 1, CURRENT_TIMESTAMP),
(3, 'Resin Designer Bangle', 1800.00, 1, CURRENT_TIMESTAMP),
(3, 'Lac Designer Bangle', 2200.00, 1, CURRENT_TIMESTAMP),
(3, 'Beaded Designer Bangle', 1500.00, 1, CURRENT_TIMESTAMP),
(3, 'Crystal Designer Bangle', 3200.00, 1, CURRENT_TIMESTAMP),
(3, 'Wooden Designer Bangle', 1200.00, 1, CURRENT_TIMESTAMP),
(3, 'Bridal Designer Bangle Set', 25000.00, 1, CURRENT_TIMESTAMP);

-- Items for Category 4 (Traditional Bangles)
INSERT INTO items (category_id, item_name, price, is_active, created_at) VALUES
(4, 'Glass Traditional Bangle', 150.00, 1, CURRENT_TIMESTAMP),
(4, 'Lac Traditional Bangle', 300.00, 1, CURRENT_TIMESTAMP),
(4, 'Plastic Traditional Bangle', 100.00, 1, CURRENT_TIMESTAMP),
(4, 'Metal Traditional Bangle', 500.00, 1, CURRENT_TIMESTAMP),
(4, 'Bone Traditional Bangle', 800.00, 1, CURRENT_TIMESTAMP),
(4, 'Ivory Traditional Bangle', 1200.00, 1, CURRENT_TIMESTAMP),
(4, 'Bamboo Traditional Bangle', 200.00, 1, CURRENT_TIMESTAMP),
(4, 'Terracotta Traditional Bangle', 250.00, 1, CURRENT_TIMESTAMP),
(4, 'Traditional Bangle Set (12 pcs)', 1500.00, 1, CURRENT_TIMESTAMP),
(4, 'Traditional Wedding Bangle Set', 3500.00, 1, CURRENT_TIMESTAMP);

-- ============================================
-- QUERY TO CHECK YOUR EXISTING CATEGORIES
-- ============================================
-- Run this first to see your category IDs:
-- SELECT category_id, category_name, is_active FROM categories;

-- ============================================
-- SINGLE ITEM INSERT (Example)
-- ============================================
-- INSERT INTO items (category_id, item_name, price, is_active, created_at) 
-- VALUES (1, 'New Item Name', 29.99, 1, CURRENT_TIMESTAMP);

