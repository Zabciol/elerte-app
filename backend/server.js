const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:3000", // adres, z którego przychodzą zapytania
    credentials: true, // pozwól na przesyłanie certyfikatów
  })
);
app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
