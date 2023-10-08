const db = require("../db");

const getUsers = async () => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    return users;
  } catch (err) {
    throw err;
  }
};

// Inne funkcje dotyczące operacji na użytkownikach...

module.exports = {
  getUsers,
  // Eksportuj inne funkcje...
};
