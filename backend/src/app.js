const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Stock Management API is running",
  });
});

app.use('/auth', authRoutes);
app.use('/products', require('./routes/product.routes'));
app.use('/stores', require('./routes/store.route'));
app.use('/stocks', require('./routes/stock.route'));

module.exports = app;