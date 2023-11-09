const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getSecretKey } = require("../db");

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

            console.log("User", userData);
            const token = jwt.sign(
              { id: userData.ID, mail: userData.Mail },
              getSecretKey(),
              { expiresIn: "8h" } // Token wygasa po 1 godzinie
            );

            console.log(token);
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

router.get("/verify-token", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1].replace(/"/g, "");
  console.log("Autoryzuje:");
  console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, getSecretKey());
      console.log("Token zdekodowany:", decoded);
      if (decoded.id) {
        userModel.findUserByEmail(decoded.mail, (err, results) => {
          if (err) {
            return res.status(500).send("Server error!");
          }
          const userData = results[0];
          res.json({ isValid: true, user: userData });
        });
      }
    } catch (error) {
      console.error("Błąd weryfikacji tokena:", error);
      res.status(401).json({ isValid: false, error: error.message });
    }
  } else {
    res.status(401).send("No token provided");
  }
});

module.exports = router;
