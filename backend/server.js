const express = require("express");
const userRoutes = require("./routes/userRoutes");
const employeesRoutes = require("./routes/employeesRoutes");
const router = require("./routes/index");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;
const config = require("./config");

app.use(
  cors({
    origin: "http://localhost:3000", // adres, z którego przychodzą zapytania
    credentials: true, // pozwól na przesyłanie certyfikatów
  })
);
app.use(express.json());
//app.use("/users", userRoutes);
//app.use("/employees", employeesRoutes);
app.use("", router);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
