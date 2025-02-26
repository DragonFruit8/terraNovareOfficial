CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    roles TEXT[] DEFAULT ARRAY['user'],
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE cart_item (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart(cart_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);


CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    amount DECIMAL(10,2) NOT NULL,
    ref VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    user_reference VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE order_item (
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, product_id)
);


CREATE TABLE product_requests (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    requested_at TIMESTAMP DEFAULT NOW(),
    product TEXT NOT NULL
);


CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_presale BOOLEAN DEFAULT FALSE,
    release_date TIMESTAMP DEFAULT NULL,
    stripe_product_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_price_id VARCHAR(255) NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0)

);


CREATE TABLE user_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ALTER TABLE cart_item ADD CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE;
-- ALTER TABLE order_item ADD CONSTRAINT fk_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;
-- ALTER TABLE product_requests ADD CONSTRAINT fk_users FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE;
-- ALTER TABLE user_files ADD CONSTRAINT fk_user_files FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

