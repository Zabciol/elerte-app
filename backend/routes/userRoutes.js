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
  const { login, password } = req.body;

  try {
    //const users = await userModel.findUserByEmail(login);
    const users = await userModel.findUserByLogin(login);
    if (users.length === 0) {
      return res.status(404).send("Nie ma takiego uzytkownika");
    }
    const userData = users[0];

    if (userData.Aktywny !== "Tak") {
      //return res.status(401).send({ message: "Account is inactive!" });
      return res.status(500).send("Konto jest nieaktywne.");
    }

    const userPasswordData = await userModel.findUserPasswordByID(userData.ID);
    if (userPasswordData.length === 0) {
      //return res.status(404).send({ message: "Nie ma takiego uzytkownika" });
      return res.status(500).send("Nie ma takiego uzytkownika.");
    }
    const userPassword = userPasswordData[0];
    bcrypt.compare(password, userPassword.Haslo, (error, isMatch) => {
      if (error) {
        //return res.status(500).send("Server error!");
        return res.status(500).send("Błąd serwera");
      }

      if (isMatch) {
        const token = jwt.sign(
          { id: userData.ID, login: login },
          getSecretKey(),
          { expiresIn: "1h" }
        );

        res.status(200).send({
          message: "User logged in!",
          user: userData,
          token: token,
          changePasswordRequired: password === "a" ? true : false,
        });
      } else {
        //res.status(401).send({ message: "Hasło jest niepoprawne!" });
        res.status(500).send("Haslo jest niepoprawne");
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    //res.status(500).send("Server error!");
    res.status(500).send("Błąd serwera");
  }
});

router.put("/changePassword", verifyToken, async (req, res) => {
  const { oldPassword, newPassword, newPasswordRepeat, userID } = req.body;
  try {
    const userPasswordData = await userModel.findUserPasswordByID(userID);
    if (userPasswordData.length === 0) {
      return res.status(200).send({
        succes: false,
        message: "Nie znaleziono hasła do twojego profilu.",
      });
    }

    if (newPassword !== newPasswordRepeat) {
      return res
        .status(200)
        .send({ succes: false, message: "Nowe hasła nie są takie same" });
    }
    if (newPassword === oldPassword) {
      return res.status(200).send({
        succes: false,
        message: "Nowe hasło musi się różnić od starego.",
      });
    }
    const userPassword = userPasswordData[0];
    bcrypt.compare(oldPassword, userPassword.Haslo, (error, isMatch) => {
      if (error) {
        return res.status(500).send("Błąd serwera");
      }

      if (isMatch) {
        userModel.changePassword(userID, newPassword);
        res.status(200).send({
          succes: true,
          message: "Zmieniono hasło!",
        });
      } else {
        res
          .status(200)
          .send({ succes: false, message: "Stare hasło jest niepoprawne" });
      }
    });
  } catch (error) {
    res.status(500).send("Wystąpił błąd podczas zmiany hasła");
  }
});

router.get("/verify-token", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]?.replace(/"/g, "");
  if (!token) {
    throw new Error("Brak tokenu uwierzytelniającego");
  }
  try {
    const decoded = jwt.verify(token, getSecretKey());
    const users = await userModel.findUserByLogin(decoded.login);
    if (users.length === 0) {
      throw new Error("Nie znaleziono uzytkownika");
    }
    const userData = users[0];
    res.json({ isValid: true, user: userData });
  } catch (error) {
    res.status(500).send("Wystąpił błąd podczas weryfikowania tokenu.");
  }
});

router.get("/vacation", verifyToken, async (req, res) => {
  try {
    const ID = req.query.ID;
    const result = await userModel.getMyVacation(ID);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

module.exports = router;
