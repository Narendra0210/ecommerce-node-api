-- ============================================
-- UPDATE UNIQUE CONSTRAINT FOR order_items TABLE
-- ============================================

-- Step 1: Drop the existing unique constraint
ALTER TABLE order_items DROP INDEX uq_user_product;

-- ============================================
-- OPTION 1: Unique constraint on user_id + product_id + order_item_id
-- ============================================
ALTER TABLE order_items 
ADD UNIQUE KEY uq_user_product_orderitem (user_id, product_id, order_item_id);

-- ============================================
-- OPTION 2: Remove unique constraint entirely
-- (Allows multiple entries of same product for same user)
-- ============================================
-- If you choose this option, comment out OPTION 1 above and uncomment below:
-- (No additional constraint needed - order_item_id is already unique as primary key)

-- ============================================
-- OPTION 3: Unique constraint on user_id + product_id + order_item_id
-- (This doesn't make sense since order_item_id is already unique)
-- ============================================
-- Note: order_item_id is the primary key and is already unique
-- Adding it to a unique constraint with user_id and product_id is redundant

-- ============================================
-- VERIFY THE CHANGE
-- ============================================
-- Run this to see all indexes on order_items table:
-- SHOW INDEXES FROM order_items;

