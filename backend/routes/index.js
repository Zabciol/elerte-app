const express = require("express");
const router = express.Router();

// Import additional routers
const usersRouter = require("./userRoutes");
const employeesRouter = require("./employeesRoutes");
const reasonsRouter = require("./reasonsRoutes");
const ecpRouter = require("./ecpRoutes");

// Use additional routers
router.use("/users", usersRouter);
router.use("/employees", employeesRouter);
router.use("/reasons", reasonsRouter);
router.use("/ecp", ecpRouter);

module.exports = router;
