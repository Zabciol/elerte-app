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

module.exports = {
  getSubordinates,
};
