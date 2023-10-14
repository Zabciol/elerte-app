const { queryDatabase } = require("../db");

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
    "SELECT Pracownicy.ID, Imie, Nazwisko, Mail, Dzialy.Nazwa AS `Dzial`FROM Pracownicy" +
      " LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID" +
      " LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID  WHERE Mail = ?",
    [email],
    callback
  );

  console.log(callback);
};
const findUserPasswordByID = (id, callback) => {
  queryDatabase("SELECT * FROM Login WHERE Pracownik_ID = ?", [id], callback);

  console.log(callback);
};

// Inne funkcje dotyczące operacji na użytkownikach...

module.exports = {
  getUsers,
  findUserByEmail,
  findUserPasswordByID,
};
