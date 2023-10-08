const bcrypt = require("bcrypt");
const { queryDatabase } = require("../db");

function migratePasswords() {
  console.log("Rozpoczynam migrację haseł...");

  queryDatabase(
    "SELECT Pracownik_ID, Haslo FROM Login",
    [],
    (error, results) => {
      if (error) {
        console.error("Błąd podczas pobierania z bazy danych:", error);
        return;
      }
      console.log(results);
      let processedUsers = 0;

      results.forEach((user) => {
        bcrypt.hash(user.Haslo, 10, (err, hash) => {
          if (err) {
            console.error("Błąd podczas hashowania:", err);
            return;
          }
          queryDatabase(
            "UPDATE Login SET Haslo = ? WHERE Pracownik_ID = ?",
            [hash, user.Pracownik_ID],
            (updateResults, updateError) => {
              if (updateError) {
                console.error(
                  "Błąd podczas aktualizacji bazy danych:",
                  updateError
                );
              }

              processedUsers++;

              if (processedUsers === results.length) {
                console.log("Migracja zakończona pomyślnie!");
              }
            }
          );
        });
      });
    }
  );
}

migratePasswords();
