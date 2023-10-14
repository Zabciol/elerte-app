const express = require("express");
const router = express.Router();

// Import additional routers
const usersRouter = require("./userRoutes");
const employeesRouter = require("./employeesRoutes");

// Use additional routers
router.use("/users", usersRouter);
router.use("/employees", employeesRouter);

module.exports = router;
