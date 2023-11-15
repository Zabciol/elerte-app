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
if (config.useHttps) {
  app.use(
    cors({
      origin: "https://ewidencja.elerte.local",
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
}
app.use(express.json());
//app.use("/users", userRoutes);
//app.use("/employees", employeesRoutes);
app.use("", router);

if (config.useHttps) {
  /*
  const httpsOptions = {
    key: fs.readFileSync("./path/to/key"),
    cert: fs.readFileSync("./path/to/cert"),
  };
  */
  httpsServer = https.createServer(config.httpsOptions, app);
  console.log(
    `Server started on https://lokalizacje.elerte.local:${config.port}`
  );
} else {
  httpsServer = app;
  console.log(`Server started on http://localhost:${config.port}`);
}

httpsServer.listen(config.port, () => {
  console.log(
    `Server running on ${config.useHttps ? "https" : "http"}://localhost:${
      config.port
    }`
  );
  //connectToDatabase();
});
