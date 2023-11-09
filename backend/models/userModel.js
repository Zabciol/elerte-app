const { queryDatabase, getSecretKey } = require("../db");

const getUsers = async () => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    return users;
  } catch (err) {
    throw err;
  }
};

const findUserByEmail = (email, callback) => {
  queryDatabase(
    "SELECT Pracownicy.ID, Imie, Nazwisko, Mail, Dzialy.Nazwa AS `Dzial`," +
      " Stanowisko.Nazwa AS `Stanowisko`, WymiarPracy.Od,WymiarPracy.`Do`, Aktywny FROM Pracownicy" +
      " LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID" +
      " LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID" +
      " LEFT JOIN WymiarPracy ON Pracownicy.WymiarPracy_ID = WymiarPracy.ID  WHERE Mail = ?",
    [email],
    callback
  );

  console.log(callback);
};
const findUserPasswordByID = (id, callback) => {
  queryDatabase("SELECT * FROM Login WHERE Pracownik_ID = ?", [id], callback);

  console.log(callback);
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]; // Token jest zazwyczaj w nagłówku 'Authorization'

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  console.log("token: ", token);
  try {
    const decoded = jwt.verify(token, getSecretKey());
    req.user = decoded; // Zdekodowane dane przypisane do obiektu zapytania
    next(); // Przejdź do następnego middleware/route handlera
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

// Inne funkcje dotyczące operacji na użytkownikach...

module.exports = {
  getUsers,
  findUserByEmail,
  findUserPasswordByID,
  verifyToken,
};
