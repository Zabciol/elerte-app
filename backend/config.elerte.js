module.exports = {
  useHttps: true,
  dbConnectionStr: {
    host: "192.168.1.190",
    user: "dev",
    password: "Elerte123!",
    database: "elerte",
    timezone: "Europe/Warsaw",
  },
  httpsOptions: {
    cert: fs.readFileSync("./ssl/elerteLocal.crt"),
    ca: fs.readFileSync("./ssl/RootCA.crt"),
    key: fs.readFileSync("./ssl/elerteLocal.key"),
  },
  hostname: "lokalizacje.elerte.local",
  port: 8000,
};