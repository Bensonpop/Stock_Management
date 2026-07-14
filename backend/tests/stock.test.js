const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Product = require('../src/models/product.model');
const Store = require('../src/models/store.model');
const Stock = require('../src/models/stock.model');
const jwt = require('jsonwebtoken');

let replSet;
let adminToken;
let testStoreA;
let testStoreB;
let testProduct;

beforeAll(async () => {
  // We MUST use a Replica Set for MongoDB transactions to work
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replSet.getUri();
  await mongoose.connect(uri);

  // Setup Admin User & Token
  const admin = await User.create({ username: 'testadmin', password: 'password123', role: 'Admin' });
  adminToken = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET || 'fallback_secret');
}, 300000); // 5 minutes to allow time to download memory server binary

afterAll(async () => {
  await mongoose.disconnect();
  if (replSet) {
    await replSet.stop();
  }
});

beforeEach(async () => {
  await Product.deleteMany({});
  await Store.deleteMany({});
  await Stock.deleteMany({});

  testStoreA = await Store.create({ name: 'Store A', location: 'City A' });
  testStoreB = await Store.create({ name: 'Store B', location: 'City B' });

  testProduct = await Product.create({
    name: 'Test Product',
    description: 'A product for testing',
    sku: 'TEST-SKU-123',
    quantity: 100,
    storeId: testStoreA._id,
    threshold: 10
  });

  await Stock.create({ productId: testProduct._id, storeId: testStoreA._id, quantity: 100 });
});

describe('Stock Transfer & Concurrency Tests', () => {

  it('should successfully transfer stock between stores', async () => {
    const res = await request(app)
      .post('/stocks/transfer')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        productId: testProduct._id,
        fromStoreId: testStoreA._id,
        toStoreId: testStoreB._id,
        quantity: 30
      });

    expect(res.statusCode).toBe(200);

    const stockA = await Stock.findOne({ storeId: testStoreA._id });
    const stockB = await Stock.findOne({ storeId: testStoreB._id });

    expect(stockA.quantity).toBe(70);
    expect(stockB.quantity).toBe(30);
  });

  it('should reject a transfer that exceeds available stock', async () => {
    const res = await request(app)
      .post('/stocks/transfer')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        productId: testProduct._id,
        fromStoreId: testStoreA._id,
        toStoreId: testStoreB._id,
        quantity: 150 // We only have 100
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Insufficient stock/i);

    // Verify stock did not change
    const stockA = await Stock.findOne({ storeId: testStoreA._id });
    expect(stockA.quantity).toBe(100);
  });

  it('should guarantee never-negative stock under concurrent requests (Race Condition Test)', async () => {
    // We have 100 stock. Let's issue 10 concurrent requests of 20 quantity each.
    // Only 5 should succeed (5 * 20 = 100). The other 5 should fail or reject.
    const concurrentRequests = 10;
    const transferAmount = 20;

    const requests = Array.from({ length: concurrentRequests }).map(() => {
      return request(app)
        .post('/stocks/transfer')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: testProduct._id,
          fromStoreId: testStoreA._id,
          toStoreId: testStoreB._id,
          quantity: transferAmount
        });
    });

    const responses = await Promise.all(requests);

    // Count how many succeeded (status 200) and how many failed (status 400)
    const successCount = responses.filter(r => r.statusCode === 200).length;
    const failureCount = responses.filter(r => r.statusCode !== 200).length;

    // Depending on transaction abort timings, some might fail with WriteConflict, 
    // but ultimately the stock MUST never go below zero.
    expect(successCount).toBeLessThanOrEqual(5);

    const stockA = await Stock.findOne({ storeId: testStoreA._id });
    const stockB = await Stock.findOne({ storeId: testStoreB._id });

    // The sum of both stores should still perfectly equal 100
    expect(stockA.quantity + (stockB ? stockB.quantity : 0)).toBe(100);
    
    // Crucially, stock MUST NOT BE NEGATIVE!
    expect(stockA.quantity).toBeGreaterThanOrEqual(0);
  });
});
