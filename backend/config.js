const environment = process.argv[2] || process.env.NODE_ENV || "elerte";

let config;
try {
  console.log(config);
  config = require(`./config.${environment}.js`);
} catch (error) {
  console.error(
    `Could not load config for environment '${environment}', using local config as fallback.`
  );
  console.error(error);
  //config = require("./config.janek.js");
}

module.exports = config;
