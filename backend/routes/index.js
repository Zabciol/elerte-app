const express = require("express");
const router = express.Router();

// Import additional routers
const usersRouter = require("./userRoutes");
const employeesRouter = require("./employeesRoutes");
const reasonsRouter = require("./reasonsRoutes");
const ecpRouter = require("./ecpRoutes");
const departmentsRouter = require("./departmentsRoutes");
const positionRouter = require("./positionRoutes");

// Use additional routers
router.use("/users", usersRouter);
router.use("/employees", employeesRouter);
router.use("/reasons", reasonsRouter);
router.use("/ecp", ecpRouter);
router.use("/departments", departmentsRouter);
router.use("/position", positionRouter);

module.exports = router;
