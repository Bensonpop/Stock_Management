require("dotenv").config();
console.log("Connecting to MongoDB...");
const app = require("./app");
const connectDB = require("./config/db");


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Connecting to MongoDB...");
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();