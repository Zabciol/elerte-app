const fs = require("fs");

module.exports = {
  useHttps: true,
  dbConnectionStr: {
    host: "192.168.1.190",
    user: "dev",
    password: "Elerte123!",
    database: "ewidencja_czasu_pracy",
    timezone: "Europe/Warsaw",
  },
  httpsOptions: {
    cert: fs.readFileSync("./ssl/elerteLocal.crt"),
    ca: fs.readFileSync("./ssl/RootCA.crt"),
    key: fs.readFileSync("./ssl/elerteLocal.key"),
  },
  hostname: "ewidencja.elerte.local",
  protocol: "https",
  port: 7999,
  api: `https://192.168.1.190:7999`,
};
