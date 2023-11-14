const environment = process.argv[2] || process.env.NODE_ENV || "local";

let config;
try {
  if (environment == "") {
    config = require(`./config.elerte.js`);
  } else {
    config = require(`./config.janek.js`);
  }
} catch (error) {
  console.error(
    `Could not load config for environment '${environment}', using local config as fallback.`
  );
  config = require("./config.local.js");
}

module.exports = config;
