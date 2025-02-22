-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    roles TEXT[] DEFAULT ARRAY['user'], -- Roles stored as an array
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 10,
    is_presale BOOLEAN DEFAULT FALSE,
    release_date TIMESTAMP,
    image_url TEXT,
    stripe_product_id TEXT UNIQUE,
    stripe_price_id TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cart Table (Each user has one cart)
CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cart Items Table (Stores items inside the cart)
CREATE TABLE cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(cart_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    UNIQUE(cart_id, product_id) -- Prevents duplicate items in the same cart
);

-- Orders Table (Stores user orders)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- Order status (e.g., pending, completed, canceled)
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table (Stores items in an order)
CREATE TABLE order_item (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL -- Stores the price at the time of purchase
);

-- Product Requests Table (Users can request a product)
CREATE TABLE product_requests (
    request_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    requested_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id) -- Prevents duplicate requests
);

-- User File Uploads Table
CREATE TABLE user_files (
    file_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) REFERENCES users(email) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Stripe Sync Data Table
CREATE TABLE stripe_data (
    stripe_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    stripe_product_id TEXT UNIQUE NOT NULL,
    stripe_price_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_order_items_order ON order_item(order_id);
CREATE INDEX idx_product_requests ON product_requests(user_id, product_id);
