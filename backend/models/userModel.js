const { queryDatabase, queryDatabasePromise, getSecretKey } = require("../db");
const bcrypt = require("bcrypt");
const getUsers = async () => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    return users;
  } catch (err) {
    throw err;
  }
};
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]?.replace(/"/g, "");
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    const decoded = jwt.verify(token, getSecretKey());
    const users = await findUserByEmail(decoded.mail);
    if (users.length === 0) {
      return res.status(404).send("User not found");
    }
    const userData = users[0];
    res.json({ isValid: true, user: userData });
  } catch (error) {
    console.error("Błąd weryfikacji tokena:", error);
    res.status(401).json({ isValid: false, error: error.message });
  }
};

const findUserByEmail = async (email) => {
  try {
    const query = `
      SELECT Pracownicy.ID, Imie, Nazwisko, Mail, Dzialy.Nazwa AS Dzial,
      Stanowisko.Nazwa AS Stanowisko, WymiarPracy.Od, WymiarPracy.Do, Aktywny FROM Pracownicy
      LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID
      LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID
      LEFT JOIN WymiarPracy ON Pracownicy.WymiarPracy_ID = WymiarPracy.ID
      WHERE Mail = ?
    `;
    const results = await queryDatabasePromise(query, [email]);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserByLogin = async (login) => {
  try {
    const query = `
      SELECT Pracownicy.ID, Imie, Nazwisko, Mail, Dzialy.Nazwa AS Dzial,
      Stanowisko.Nazwa AS Stanowisko, Stanowisko.Dzial_ID, WymiarPracy.Od, WymiarPracy.Do, Aktywny, Uprawnienia_ID AS Uprawnienia FROM Pracownicy
      LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID
      LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID
      LEFT JOIN WymiarPracy ON Pracownicy.WymiarPracy_ID = WymiarPracy.ID
      LEFT JOIN Login ON Pracownicy.ID = Login.Pracownik_ID
      WHERE Login.Login = ?
    `;
    const results = await queryDatabasePromise(query, [login]);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findUserPasswordByID = async (id) => {
  try {
    const query = "SELECT * FROM Login WHERE Pracownik_ID = ?";
    const results = await queryDatabasePromise(query, [id]);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const changePassword = async (userID, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE Login SET Haslo = ? WHERE Pracownik_ID = ?";
    const results = queryDatabasePromise(query, [hashedPassword, userID]);
    return {
      success: true,
      message: "Hasło zmieniono pomyślnie!",
      data: results,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas aktualizacji hasła:", error);
    throw error;
  }
};

const getMyVacation = async (ID) => {
  try {
    const query = `Select * from UrlopyInf WHERE Pracownik_ID = ?`;
    const results = await queryDatabasePromise(query, [ID]);
    return {
      success: true,
      message: "Urlopy pozyskano pomyślnie!",
      data: results[0],
    };
  } catch (error) {
    throw error;
  }
};

// Inne funkcje dotyczące operacji na użytkownikach...

module.exports = {
  getUsers,
  findUserByEmail,
  findUserByLogin,
  findUserPasswordByID,
  changePassword,
  verifyToken,
  getMyVacation,
};
