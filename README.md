# Stock Movement (StockFlow)

A robust, full-stack inventory management system that guarantees data integrity under concurrent loads.

## Prerequisites
- **Node.js**: v18 or newer
- **MongoDB**: A running MongoDB instance configured as a **Replica Set** (required for transaction support).

## Setup Instructions

### 1. Backend Setup
Navigate into the backend directory, install dependencies, and configure your environment:
```bash
cd backend
npm install
```

Copy the example environment file and update it with your actual MongoDB URI:
```bash
cp .env.example .env
```
*(Ensure `MONGO_URI` points to a MongoDB Replica Set if you want to test stock transfers, as MongoDB requires Replica Sets for multi-document transactions).*

Start the backend server:
```bash
npm run dev
```
The backend will run on `http://localhost:3000`.

### 2. Frontend Setup
Navigate into the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will typically run on `http://localhost:5173`.

### 3. Database Seeding (Optional)
The system is designed to be self-initializing. You can seed data simply by:
1. Registering a new user via the UI and selecting the **Admin** role.
2. Logging in and using the Admin Dashboard to create your first Stores and Products.

## Running Automated Tests
The backend includes a comprehensive test suite (using Jest and Supertest) to verify core logic, including concurrency guarantees and atomic transfers. 

The tests use `mongodb-memory-server` to automatically spin up an isolated, in-memory MongoDB Replica Set, so **you do not need a live database to run the tests**.

To run the tests:
```bash
cd backend
npm test
```

## Assumptions & Trade-offs
- **Vanilla CSS**: Per requirements, the frontend UI was built entirely without utility frameworks like Tailwind. We relied on pure CSS grids, flexbox, and modern glassmorphism aesthetics.
- **Transactions vs Replica Sets**: To achieve true atomicity on stock transfers, MongoDB Transactions were used. A trade-off here is that MongoDB *requires* a Replica Set to use transactions. If running against a standalone local MongoDB, transfers will throw an error.
- **Frontend Role Selection**: For demonstration and testing purposes, the Registration page allows the user to explicitly select whether they are an `Admin` or `Shopper`. In a real-world scenario, Admin roles would be tightly guarded or assigned manually via a super-admin portal.
