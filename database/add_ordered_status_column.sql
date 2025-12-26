-- Add ordered_status column to orders table
ALTER TABLE orders 
ADD COLUMN ordered_status VARCHAR(50) DEFAULT 'pending' AFTER status;

-- Optional: Add index for faster queries
ALTER TABLE orders 
ADD INDEX idx_ordered_status (ordered_status);

