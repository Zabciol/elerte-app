const express = require("express");
const router = express.Router();

// Import additional routers
const usersRouter = require("./users");

// Use additional routers
router.use("/users", usersRouter);

module.exports = router;
