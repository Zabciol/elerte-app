const express = require("express");
const router = require("./routes/index");
const cors = require("cors");
const app = express();
const config = require("./config");

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
app.use("", router);

if (config.useHttps) {
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
