const { connection, queryDatabase, queryDatabasePromise } = require("../db");
const bcrypt = require("bcrypt");

const getSubordinates = async (id) => {
  const query =
    "SELECT Pracownicy.ID, Imie, Nazwisko, Stanowisko.Nazwa AS `Stanowisko`, Dzialy.Nazwa AS `Dzial`, WymiarPracy.Od, WymiarPracy.`Do` , Aktywny" +
    " FROM Pracownicy LEFT JOIN Hierarchia ON Pracownicy.ID = Hierarchia.Podwladny_ID LEFT JOIN Stanowisko" +
    " ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID" +
    " LEFT JOIN WymiarPracy ON Pracownicy.WymiarPracy_ID = WymiarPracy.ID WHERE Przelozony_ID = ?";
  return await queryDatabasePromise(query, [id]);
};

const getSupervisors = async () => {
  const query =
    "SELECT Pracownicy.ID, Imie, Nazwisko, Dzialy.Nazwa, Dzialy.ID AS `Dzial_ID` FROM Pracownicy LEFT JOIN Hierarchia ON Pracownicy.ID = Hierarchia.Przelozony_ID " +
    "LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
    "GROUP BY Hierarchia.Przelozony_ID";
  return await queryDatabasePromise(query, []);
};

const getWorkedHoursByEmployee = async (employeeId, month) => {
  const query =
    `SELECT Pracownik_ID, DATE_FORMAT(Data, '%Y-%m') as Miesiac, SUM(IloscGodzin) as SumaGodzin ` +
    `FROM ECP WHERE Pracownik_ID = ? AND Month(Data) = ? GROUP BY Pracownik_ID, DATE_FORMAT(Data, '%Y-%m')`;

  return await queryDatabasePromise(query, [employeeId, month]);
};

const getEmployeeCasualInf = async (id) => {
  const results = await queryDatabasePromise(
    "SELECT ID, Imie, Nazwisko, Mail, NrTelefonu FROM Pracownicy WHERE ID = ?",
    [id]
  );

  // Zwróć pierwszy element tablicy wyników, jeśli istnieje
  return results.length > 0 ? results[0] : null;
};

const getEmployeeInf = async (employeeId) => {
  // Pobranie informacji podstawowych o pracowniku
  const employeeQuery =
    "SELECT DISTINCT p.ID, p.Imie, p.Nazwisko, p.Mail, p.NrTelefonu, s.ID AS StanowiskoID, s.Nazwa AS StanowiskoNazwa, p.WymiarPracy_ID, d.ID AS DzialID, d.Nazwa AS DzialNazwa " +
    "FROM Pracownicy p LEFT JOIN Stanowisko s ON p.Stanowisko_ID = s.ID LEFT JOIN Dzialy d ON s.Dzial_ID = d.ID " +
    "WHERE p.ID = ?;";

  const employeeInfo = await queryDatabasePromise(employeeQuery, [employeeId]);

  // Pobranie informacji o przełożonych pracownika
  const supervisorsInfo = await getMyDirectSupervisors(employeeId);

  // Tworzenie obiektu pracownika z dodaną tablicą przełożonych
  let employee = employeeInfo[0] || {};
  employee.przelozeni = supervisorsInfo;

  return employee;
};

const getAllEmployees = async () => {
  const query =
    "SELECT Pracownicy.ID, Imie, Nazwisko ,Stanowisko.Nazwa AS `Stanowisko`, Dzialy.ID AS `DzialID`,  Dzialy.Nazwa AS `Dzial` FROM Pracownicy LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID";

  return await queryDatabasePromise(query, []);
};

const addEmployee = async (employee) => {
  const query = "INSERT INTO Pracownicy SET ?";
  await queryDatabasePromise(query, employee);
  const selectQuery = "SELECT LAST_INSERT_ID() as lastId";
  const result = await queryDatabasePromise(selectQuery);
  return result[0].lastId;
};

const addToHierarchy = async (supervisorID, suburdinateID) => {
  const query =
    "INSERT INTO Hierarchia (Przelozony_ID, Podwladny_ID) VALUES (?, ?)";
  return await queryDatabasePromise(query, [supervisorID, suburdinateID]);
};
const removeFromHierarchy = async (supervisorID, suburdinateID) => {
  const query =
    "DELETE FROM Hierarchia WHERE Przelozony_ID = ? AND Podwladny_ID = ?";
  return await queryDatabasePromise(query, [supervisorID, suburdinateID]);
};

const addLoginAndPassword = async (idPracownika, login) => {
  try {
    console.log("id pracownika:", idPracownika);
    console.log("login: ", login);
    const plainPassword = "a";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const query =
      "INSERT INTO Login (Login, Haslo, Pracownik_ID) VALUES (?,?,?)";
    return await queryDatabasePromise(query, [
      login,
      hashedPassword,
      idPracownika,
    ]);
  } catch (error) {
    console.error("Wystąpił błąd podczas zapisywania hasła i loginu:", error);
    throw new Error(error);
  }
};

const addNewEmployee = async (data) => {
  try {
    await queryDatabase("START TRANSACTION");
    const pracownikID = await addEmployee({
      Imie: data.name,
      Nazwisko: data.lastname,
      Mail: data.email,
      NrTelefonu: data.telephoneNumber,
      Stanowisko_ID: data.position,
      WymiarPracy_ID: data.workingTime,
    });
    const login = deletePolishChars(
      data.name + "." + data.lastname
    ).toLowerCase();

    await addLoginAndPassword(pracownikID, login);

    if (data.supervisor) {
      await addToHierarchy(data.supervisor, pracownikID);
    }

    if (data.subordinates && data.subordinates.length) {
      for (let subID of data.subordinates) {
        await addToHierarchy(pracownikID, subID);
      }
    }
    if (
      data.isManager &&
      (!data.subordinates || data.subordinates.length === 0)
    ) {
      await addToHierarchy(pracownikID, null);
    }
    await queryDatabase("COMMIT");
    return { success: true, message: "Pracownik został dodany poprawnie" };
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    await queryDatabase("ROLLBACK");
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

const getMyDirectSupervisors = async (id) => {
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
      resolve(results);
    });
  });
};
const getAllMySupervisors = async (employeeId, allSupervisors = []) => {
  try {
    const supervisors = await getMyDirectSupervisors(employeeId);
    console.log(supervisors);
    if (supervisors.length === 0) {
      console.log("Koniec przełozonych");
      // Brak dalszych przełożonych, zwróć zebrane wyniki
      return allSupervisors;
    }

    for (let supervisor of supervisors) {
      if (
        supervisor.ID &&
        !allSupervisors.some((s) => s.ID === supervisor.ID)
      ) {
        allSupervisors.push(supervisor);
        await getAllMySupervisors(supervisor.ID, allSupervisors);
      }
    }

    //return allSupervisors;
    return {
      success: true,
      message: "Poprawnie pobrano twoich wszystkich przełozonych",
      data: allSupervisors,
    };
  } catch (error) {
    console.error("Błąd podczas pobierania przełożonych:", error);
    return [];
  }
};

const updateEmployeeMainData = async (employee) => {
  return await queryDatabasePromise(
    "UPDATE Pracownicy SET Imie = ?, Nazwisko = ?, Mail = ?, NrTelefonu = ?, Stanowisko_ID = ?, WymiarPracy_ID = ? WHERE ID = ?",
    [
      employee.name,
      employee.lastname,
      employee.mail,
      employee.phoneNumber,
      employee.positionID,
      employee.workingTimeID,
      employee.ID,
    ]
  );
};

const updateEmployee = async (employeeData) => {
  const {
    ID,
    departmentID,
    lastname,
    mail,
    name,
    phoneNumber,
    positionID,
    subordinates,
    supervisorID,
    workingTimeID,
  } = employeeData;

  try {
    const currentEmployee = await getEmployeeInf(ID);
    const currentDataEmployee = currentEmployee[0];

    if (
      currentDataEmployee &&
      (currentDataEmployee.DzialID !== departmentID ||
        currentDataEmployee.Imie !== name ||
        currentDataEmployee.Nazwisko !== lastname ||
        currentDataEmployee.NrTelefonu !== phoneNumber ||
        currentDataEmployee.Mail !== mail ||
        currentDataEmployee.Stanowisko_ID !== positionID ||
        currentDataEmployee.WymiarPracy_ID !== workingTimeID)
    ) {
      await updateEmployeeMainData(employeeData);
    }

    const currentSupervisor = await getMySupervisor(ID);
    const currentSupervisorID = currentSupervisor.ID;

    if (
      currentSupervisorID &&
      Number(currentSupervisorID) !== Number(supervisorID)
    ) {
      await removeFromHierarchy(currentSupervisorID, ID);
      await addToHierarchy(supervisorID, ID);
    }

    const currentSubordinates = await getSubordinates(ID);
    if (currentSubordinates) {
      const currentSubordinatesIDs = currentSubordinates.map(
        (subordinate) => subordinate.ID
      );

      const subordinatesToAdd = subordinates.filter(
        (id) => !currentSubordinatesIDs.includes(id)
      );
      const subordinatesToRemove = currentSubordinatesIDs.filter(
        (id) => !subordinates.includes(id)
      );

      // Dodaj nowych podwładnych
      for (const subordinateId of subordinatesToAdd) {
        //await db.addSubordinate(ID, subordinateId, transaction);
        await addToHierarchy(ID, subordinateId);
      }

      // Usuń nieaktualnych podwładnych
      for (const subordinateId of subordinatesToRemove) {
        //await db.removeSubordinate(ID, subordinateId, transaction);
        await removeFromHierarchy(ID, subordinateId);
      }
    }
    return { success: true, message: "Employee updated successfully." };
  } catch (error) {
    // W przypadku błędu, wycofaj transakcję
    console.error("Error during employee update:", error);
    throw error;
    return { success: false, message: "Failed to update employee.", error };
  }
};

const deleteEmployee = (employeeID) => {
  return new Promise((resolve, reject) => {
    const query = "Update Pracownicy set Aktywny = 'Nie' WHERE ID = ?";
    queryDatabase(query, [employeeID], (err) => {
      if (err) {
        console.error("Error during employee deleting:", err);
        return reject(err); // Log the error and reject the promise
      }
      resolve(); // Resolve the promise when the update is successful
    });
  });
};

const getMyDirectSubordinates = async (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Pracownicy.ID, Imie, Nazwisko, Stanowisko.Nazwa AS `Stanowisko`, Dzialy.Nazwa AS `Dzial` " +
      "FROM Pracownicy LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID " +
      "LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
      "LEFT JOIN Hierarchia ON Pracownicy.ID = Hierarchia.Podwladny_ID " +
      "WHERE Hierarchia.Przelozony_ID = ?";
    queryDatabase(query, [id], (err, results) => {
      if (err) {
        reject(err);
        return {
          success: false,
          message: "Wystąpił błąd podczas dodawania pracownika i zależności.",
        };
      }
      resolve(results ? results : null);
    });
  });
};

const deletePolishChars = (tekst) => {
  const znaki = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ż: "z",
    ź: "z",
    Ą: "A",
    Ć: "C",
    Ę: "E",
    Ł: "L",
    Ń: "N",
    Ó: "O",
    Ś: "S",
    Ż: "Z",
    Ź: "Z",
  };

  return tekst
    .split("")
    .map((znak) => znaki[znak] || znak)
    .join("");
};
module.exports = {
  getSubordinates,
  getWorkedHoursByEmployee,
  getEmployeeInf,
  getSupervisors,
  getMyDirectSupervisors,
  getAllMySupervisors,
  getAllEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
  getMyDirectSubordinates,
  getEmployeeCasualInf,
};
