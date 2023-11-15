const fs = require("fs");

module.exports = {
  useHttps: true,
  dbConnectionStr: {
    host: "192.168.1.190",
    user: "dev",
    password: "Elerte123!",
    database: "elerte_app",
    timezone: "Europe/Warsaw",
  },
  httpsOptions: {
    cert: fs.readFileSync("./ssl/elerteLocal.crt"),
    ca: fs.readFileSync("./ssl/RootCA.crt"),
    key: fs.readFileSync("./ssl/elerteLocal.key"),
  },
  hostname: "ewidencja.elerte.local",
  port: 7999,
  protocol: "https",
  api: `https://192.168.1.190:7999`,
};
