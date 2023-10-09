const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
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

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).send("Server error!");
    }
    const id = results[0].ID;
    const userData = results[0];

    userModel.findUserPasswordByID(id, (err, results) => {
      if (results.length > 0) {
        const user = results[0];

        bcrypt.compare(password, user.Haslo, (error, isMatch) => {
          if (error) {
            return res.status(500).send("Server error!");
          }

          if (isMatch) {
            // Możesz tu utworzyć token JWT lub sesję, jeśli chcesz
            res
              .status(200)
              .send({ message: "User logged in!", user: userData });
          } else {
            res.status(401).send("Password is incorrect!");
          }
        });
      } else {
        res.status(404).send("User not found!");
      }
    });
  });
});

module.exports = router;
