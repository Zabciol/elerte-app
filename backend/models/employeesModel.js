const { queryDatabase } = require("../db");

const getSubordinates = (id, callback) => {
  queryDatabase(
    "SELECT Pracownicy.ID, Imie, Nazwisko, Stanowisko, Nazwa AS `Dzial`, WymiarPracy.Od, WymiarPracy.`Do`" +
      " FROM Pracownicy LEFT JOIN Hierarchia ON Pracownicy.ID = Hierarchia.Podwladny_ID LEFT JOIN Stanowisko" +
      " ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID" +
      " LEFT JOIN WymiarPracy ON Pracownicy.WymiarPracy_ID = WymiarPracy.ID WHERE Przelozony_ID = ?",
    [id],
    callback
  );
  console.log("Wysłano zapytanie do bazy");
};

const getWorkedHoursByEmployee = (employeeId, month) => {
  return new Promise((resolve, reject) => {
    const query =
      `SELECT Pracownik_ID, DATE_FORMAT(Data, '%Y-%m') as Miesiac, SUM(IloscGodzin) as SumaGodzin ` +
      `FROM ECP WHERE Pracownik_ID = ? AND DATE_FORMAT(Data, '%Y-%m') = ? GROUP BY Pracownik_ID, DATE_FORMAT(Data, '%Y-%m')`;

    queryDatabase(query, [employeeId, month], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

module.exports = {
  getSubordinates,
  getWorkedHoursByEmployee,
};
