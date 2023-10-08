const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS issues (optional, depending on your frontend setup)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Import routes
const routes = require("./routes");

// Use routes
app.use("/api", routes);

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// Middleware to handle all other errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
