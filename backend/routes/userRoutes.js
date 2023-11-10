const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getSecretKey } = require("../db");
const { verifyToken } = require("../db");

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await userModel.getUsers();
    res.json(users);
  } catch (err) {
    throw new Error(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Próba zalogowania");

  try {
    const users = await userModel.findUserByEmail(email);
    if (users.length === 0) {
      return res.status(404).send({ message: "Nie ma takiego uzytkownika" });
    }
    const userData = users[0];

    if (userData.Aktywny !== "Tak") {
      return res.status(401).send({ message: "Account is inactive!" });
    }

    const userPasswordData = await userModel.findUserPasswordByID(userData.ID);
    if (userPasswordData.length === 0) {
      return res.status(404).send({ message: "Nie ma takiego uzytkownika" });
    }
    const userPassword = userPasswordData[0];

    bcrypt.compare(password, userPassword.Haslo, (error, isMatch) => {
      if (error) {
        return res.status(500).send("Server error!");
      }

      if (isMatch) {
        console.log("Zalogowano");

        const token = jwt.sign(
          { id: userData.ID, mail: userData.Mail },
          getSecretKey(),
          { expiresIn: "1h" }
        );

        res.status(200).send({
          message: "User logged in!",
          user: userData,
          token: token,
        });
      } else {
        res.status(401).send({ message: "Hasło jest niepoprawne!" });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error!");
  }
});

router.get("/verify-token", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]?.replace(/"/g, "");
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego");
  }
  try {
    const decoded = jwt.verify(token, getSecretKey());
    const users = await userModel.findUserByEmail(decoded.mail);
    if (users.length === 0) {
      console.log("Nie znaleziono uzytkownika");
      throw new Error("Nie znaleziono uzytkownika");
    }
    const userData = users[0];
    res.json({ isValid: true, user: userData });
  } catch (error) {
    res.status(500).send("Wystąpił błąd podczas weryfikowania tokenu.");
  }
});

module.exports = router;
