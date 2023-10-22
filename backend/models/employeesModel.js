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
};

const getSupervisors = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Pracownicy.ID, Imie, Nazwisko, Dzialy.Nazwa FROM Pracownicy LEFT JOIN Hierarchia ON Pracownicy.ID = Hierarchia.Przelozony_ID " +
      "LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
      "GROUP BY Hierarchia.Przelozony_ID";
    queryDatabase(query, [], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
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

const getEmployeeInf = (employeeId) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT p.Imie,p.Nazwisko, p.Mail, p.NrTelefonu, s.Stanowisko,d.Nazwa AS DzialNazwa, przelozony.Imie AS PrzelozonyImie, przelozony.Nazwisko AS PrzelozonyNazwisko, przelozony.Mail AS PrzelozonyMail" +
      " FROM Pracownicy p LEFT JOIN Hierarchia h ON p.ID = h.Podwladny_ID LEFT JOIN Stanowisko s ON p.Stanowisko_ID = s.ID LEFT JOIN Dzialy d ON s.Dzial_ID = d.ID" +
      " LEFT JOIN Hierarchia h2 ON p.ID = h2.Podwladny_ID LEFT JOIN Pracownicy przelozony ON h2.Przelozony_ID = przelozony.ID WHERE p.ID = ?";

    queryDatabase(query, [employeeId], (error, results) => {
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
  getEmployeeInf,
  getSupervisors,
};
