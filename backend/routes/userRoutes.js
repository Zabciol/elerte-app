const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey =
  "37x!A%D*G-KaPdSgVkYp3s6v9y$B&E)H@McQfTjWnZr4u7w!z%C*F-JaNnRfUjXn";

router.get("/", async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Próba zalogowania");

  userModel.findUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).send("Server error!");
    }
    const id = results[0].ID;
    const userData = results[0];

    console.log(userData);
    userModel.findUserPasswordByID(id, (err, results) => {
      if (results.length > 0 || userData.Aktywny !== "Tak") {
        const user = results[0];
        console.log(user);

        bcrypt.compare(password, user.Haslo, (error, isMatch) => {
          if (error) {
            return res.status(500).send("Server error!");
          }

          if (isMatch) {
            console.log("Zalogowano");

            const token = jwt.sign(
              { id: user.ID, email: user.Mail },
              secretKey,
              { expiresIn: "1h" } // Token wygasa po 1 godzinie
            );

            res.status(200).send({
              message: "User logged in!",
              user: userData,
              token: token,
            });
          } else {
            res.status(401).send({ message: "Password is incorrect!" });
          }
        });
      } else {
        res.status(404).send("User not found!");
      }
    });
  });
});

module.exports = router;
