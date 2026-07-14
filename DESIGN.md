# Architecture & Design Specifications

## Data Model
The system uses  MongoDB  as the persistent data store with Mongoose for Object Data Modeling. The model is structured across four primary entities:

1.  User : Handles authentication and role-based access (`Admin`, `Shopper`).
2.  Store : Represents physical warehouse/store locations. Uniqueness is enforced on the `name` field.
3.  Product : Represents the catalog of items. Uniqueness is enforced on the `sku` field at the database level.
4.  Stock : A relational join collection bridging `Product` and `Store`. 
   - A compound unique index exists on `{ productId: 1, storeId: 1 }` to guarantee a product only has one distinct stock document per store.

## The "Never-Negative" Guarantee
Preventing stock from dipping below zero during concurrent requests (race conditions) is a notoriously difficult problem if handled purely in application code (e.g. read the stock, check if `> quantity`, then write).

We guarantee stock never drops below zero by leveraging  Database-level constraints and atomic operators :
- In `stock.model.js`, the `quantity` field has a `min: [0, 'Stock cannot be negative']` constraint.
- When transferring stock, we use MongoDB's atomic `$inc` operator (`$inc: { quantity: -transferAmount }`).
- Because of the schema validation and the atomic nature of `$inc`, if two concurrent transactions attempt to decrement the last 10 units of a product, the database itself will reject the second transaction outright, preventing negative quantities at the data layer.

## Atomic Transfers
A stock transfer requires two operations: decrementing the source store, and incrementing the destination store. If the server crashes between these two operations, stock would be permanently lost.

To guarantee  Atomicity  (all-or-nothing), we use  MongoDB Transactions :
```javascript
const session = await Stock.startSession();
session.startTransaction();
try {
  // 1. Decrement source store using $inc
  // 2. Increment destination store using $inc
  await session.commitTransaction();
} catch (error) {
  // If anything fails (including the never-negative validation), abort everything
  await session.abortTransaction();
}
```
Transactions ensure that a transfer must fully succeed (both decrement and increment) or fully fail, eliminating the risk of dangling or missing inventory.
