const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
