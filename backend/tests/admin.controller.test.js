import { addProduct } from './admin.controller';
import pool from '../config/db.js';
import stripe from '../stripe.js';

// Mock the database pool and Stripe methods
jest.mock('../config/db.js');
jest.mock('../stripe.js');

describe("addProduct Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add a product successfully", async () => {
    // Arrange: prepare a fake request and response
    const req = {
      body: {
        name: "Gold Membership",
        price: 78.00,
        slug: "gold-membership",
        stock: 5,
      },
    };

    // Mock Stripe's product and price creation
    stripe.products = {
      create: jest.fn().mockResolvedValue({ id: "prod_Rp7LR8bTbIkfhB" }),
    };
    stripe.prices = {
      create: jest.fn().mockResolvedValue({ id: "price_123" }),
    };

    // Simulate a successful DB insertion
    pool.query.mockResolvedValue({
      rows: [{
        id: 5,
        name: "Gold Membership",
        slug: "gold-membership",
        price: 78.00,
        stock: 5,
        stripe_product_id: "prod_Rp7LR8bTbIkfhB",
        stripe_price_id: "price_123"
      }],
    });

    // Create a fake response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act: call your controller
    await addProduct(req, res);

    // Assert: verify that all expected methods were called correctly
    expect(stripe.products.create).toHaveBeenCalledWith({ name: "Gold Membership" });
    expect(stripe.prices.create).toHaveBeenCalledWith({
      unit_amount: Math.round(78.00 * 100),
      currency: "usd",
      product: "prod_Rp7LR8bTbIkfhB",
    });
    expect(pool.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 5,
      name: "Gold Membership",
      slug: "gold-membership",
      price: 78.00,
      stock: 5,
      stripe_product_id: "prod_Rp7LR8bTbIkfhB",
      stripe_price_id: "price_123",
    });
  });

  it("should return 500 if an error occurs", async () => {
    // Arrange: simulate an error (e.g., in Stripe product creation)
    const req = {
      body: {
        name: "Gold Membership",
        price: 78.00,
        slug: "gold-membership",
        stock: 5,
      },
    };

    stripe.products = {
      create: jest.fn().mockRejectedValue(new Error("Stripe error")),
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Act
    await addProduct(req, res);

    // Assert: ensure error handling returns a 500
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to add product" });
  });
});
