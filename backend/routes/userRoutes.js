const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Return user with ID ${userId}` });
});

router.post("/", (req, res) => {
  res.json({ message: "User added" });
});

router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User with ID ${userId} deleted` });
});

module.exports = router;
