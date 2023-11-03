const { queryDatabase } = require("../db");
const bcrypt = require("bcrypt");

const getSubordinates = (id, callback) => {
  queryDatabase(
    "SELECT Pracownicy.ID, Imie, Nazwisko, Stanowisko.Nazwa AS `Stanowisko`, Dzialy.Nazwa AS `Dzial`, WymiarPracy.Od, WymiarPracy.`Do`" +
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
      "SELECT DISTINCT p.ID, p.Imie,p.Nazwisko, p.Mail, p.NrTelefonu, s.Nazwa AS StanowiskoNazwa,d.ID AS DzialID, d.Nazwa AS DzialNazwa," +
      "przelozony.ID AS PrzelozonyID,przelozony.Imie AS PrzelozonyImie, przelozony.Nazwisko AS PrzelozonyNazwisko, przelozony.Mail AS PrzelozonyMail, dzialPrzelozony.Nazwa AS DzialPrzelozonyNazwa " +
      "FROM Pracownicy p LEFT JOIN Hierarchia h ON p.ID = h.Podwladny_ID LEFT JOIN Stanowisko s ON p.Stanowisko_ID = s.ID LEFT JOIN Dzialy d ON s.Dzial_ID = d.ID " +
      "LEFT JOIN Pracownicy przelozony ON h.Przelozony_ID = przelozony.ID LEFT JOIN Stanowisko stanowiskoPrzelozony ON przelozony.Stanowisko_ID = stanowiskoPrzelozony.ID " +
      "LEFT JOIN Dzialy dzialPrzelozony ON stanowiskoPrzelozony.Dzial_ID = dzialPrzelozony.ID " +
      "WHERE p.ID = ?;";

    queryDatabase(query, [employeeId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};
const getAllEmployees = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Pracownicy.ID, Imie, Nazwisko , Dzialy.Nazwa AS `Dzial` FROM Pracownicy LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID";

    queryDatabase(query, [], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

const addEmployee = async (employee) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO Pracownicy SET ?";
    queryDatabase(query, employee, (err, result) => {
      if (err) reject(err);
      resolve(result.insertId);
    });
  });
};

const addToHierarchy = async (supervisorID, suburdinateID) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Hierarchia (Przelozony_ID, Podwladny_ID) VALUES (?, ?)";
    queryDatabase(query, [supervisorID, suburdinateID], (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const addPassword = async (idPracownika) => {
  try {
    const plainPassword = "a";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const query = "INSERT INTO Login (Haslo, Pracownik_ID) VALUES (?,?)";
    queryDatabase(query, [hashedPassword, idPracownika], (error, results) => {
      if (error) throw error;
      console.log("Hasło dodano pomyślnie!");
    });
  } catch (error) {
    console.error("Wystąpił błąd podczas zapisywania hasła:", error);
  }
};

const addNewEmployee = async (data) => {
  try {
    const pracownikID = await addEmployee({
      Imie: data.name,
      Nazwisko: data.lastname,
      Mail: data.email,
      NrTelefonu: data.telephoneNumber,
      Stanowisko_ID: data.position,
      WymiarPracy_ID: data.workingTime,
    });

    addPassword(pracownikID);

    if (data.supervisor) {
      await addToHierarchy(data.supervisor, pracownikID);
      console.log("Dodano przełoonego uzytkownika");
    }

    if (data.subordinates && data.subordinates.length) {
      for (let subID of data.subordinates) {
        await addToHierarchy(pracownikID, subID);
      }
      console.log("dodano podwladnych uzytkownika");
    }
    if (
      data.isManager &&
      (!data.subordinates || data.subordinates.length === 0)
    ) {
      await addToHierarchy(pracownikID, null);
    }

    return { success: true, message: "Wszystko dodane poprawnie" };
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    return {
      success: false,
      message: "Wystąpił błąd podczas dodawania pracownika i zależności.",
    };
  }
};

const getMySupervisor = async (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Imie,Nazwisko,Mail, Pracownicy.ID FROM Hierarchia LEFT JOIN Pracownicy ON Pracownicy.ID = Hierarchia.Przelozony_ID WHERE Podwladny_ID = ?";
    queryDatabase(query, [id], (err, results) => {
      if (err) {
        reject(err);
        return {
          success: false,
          message: "Wystąpił błąd podczas dodawania pracownika i zależności.",
        };
      }
      resolve(results[0] ? results[0] : null);
    });
  });
};

module.exports = {
  getSubordinates,
  getWorkedHoursByEmployee,
  getEmployeeInf,
  getSupervisors,
  getAllEmployees,
  addNewEmployee,
  getMySupervisor,
};
