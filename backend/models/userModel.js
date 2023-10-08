const queryDatabase = require("../db/index");

const getUsers = async () => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    return users;
  } catch (err) {
    throw err;
  }
};

const findUserByEmail = (email, callback) => {
  queryDatabase("SELECT * FROM Pracownicy WHERE Mail = ?", [email], callback);
};
const findUserPasswordByID = (id, callback) => {
  queryDatabase("SELECT * FROM Login WHERE Pracownik_ID = ?", [id], callback);
};

// Inne funkcje dotyczące operacji na użytkownikach...

module.exports = {
  getUsers,
  findUserByEmail,
  findUserPasswordByID,
};
