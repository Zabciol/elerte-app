const db = require("../db");
const { queryDatabase } = require("../db");

const queryDatabaseAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    queryDatabase(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const getRecordsByDateAndEmployeeId = async (date, employeeIds) => {
  return await queryDatabaseAsync(
    "SELECT * FROM ECP WHERE Data = ? AND Pracownik_ID IN (?)",
    [date, employeeIds]
  );
};

const findExistingRecords = async (records, date) => {
  //const date = records[0].date;
  const employeeIds = records.map((r) => r.employeeID);
  return await getRecordsByDateAndEmployeeId(date, employeeIds);
};

const updateRecordInDB = async (record, date, editDate, editUser) => {
  return await queryDatabaseAsync(
    "UPDATE ECP SET Od_godz = ?, Do_godz = ?, IloscGodzin = ?, Powod_ID = ?, DataZapisu = ?, ID_Edytora = ? WHERE Data = ? AND Pracownik_ID = ?",
    [
      record.Od_Godz,
      record.Do_Godz,
      record.hours,
      record.reason,
      editDate,
      editUser,
      date,
      record.employeeID,
    ]
  );
};

const insertRecordsInDB = async (toInsert, date, editDate, editUser) => {
  const insertData = toInsert.map((record) => [
    date,
    record.Od_Godz,
    record.Do_Godz,
    record.employeeID,
    record.reason,
    record.hours,
    editDate,
    editUser,
  ]);
  return await queryDatabaseAsync(
    "INSERT INTO ECP (Data, Od_godz, Do_godz, Pracownik_ID, Powod_ID, IloscGodzin, DataZapisu, ID_Edytora) VALUES ?",
    [insertData]
  );
};

const SentECPToDatabase = async (records) => {
  const { ecpList, date, editDate, editUser } = records;
  try {
    const existingRecords = await findExistingRecords(ecpList, date);
    const toUpdate = [];
    const toInsert = [];

    for (const record of ecpList) {
      const found = existingRecords.some(
        (er) => er.Data === date && er.Pracownik_ID === record.employeeID
      );
      if (found) {
        toUpdate.push(record);
      } else {
        toInsert.push(record);
      }
    }

    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map((record) =>
          updateRecordInDB(record, date, editDate, editUser)
        )
      );
    }

    if (toInsert.length > 0) {
      await insertRecordsInDB(toInsert, date, editDate, editUser);
    }

    console.log("Zaktualizowane pola: " + toUpdate.length);
    console.log("Dodane pola: " + toInsert.length);
    return {
      updated: toUpdate.length,
      inserted: toInsert.length,
      message: "Poprawnie wysłano ECP",
    };
  } catch (error) {
    console.error("Error in updateOrCreate function:", error);
    throw new Error("Nie udało się przetworzyć żądania ECP");
  }
};

const checkECPForEmployeeOnDate = async (employeeId, date) => {
  try {
    const results = await getRecordsByDateAndEmployeeId(date, [employeeId]);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in checkECPForEmployeeOnDate function:", error);
    throw new Error("Nie udało się sprawdzić ECP dla danego pracownika i daty");
  }
};

const getAbsencesForMonth = (date, employeesID) => {
  console.log("w modelu");
  console.log(employeesID);
  const [year, month] = date.split("-");
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Pracownicy.ID, Imie, Nazwisko, IloscGodzin, ECP.Od_godz, ECP.Do_godz, WymiarPracy.Od AS `WymiarOd`, WymiarPracy.`Do` AS `WymiarDo`, " +
      "PowodyNieobecnosci.Nazwa AS `Powod`, `Data` FROM ECP LEFT JOIN Pracownicy ON Pracownicy.ID = ECP.Pracownik_ID " +
      "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = ECP.Powod_ID LEFT JOIN WymiarPracy ON WymiarPracy.ID = Pracownicy.WymiarPracy_ID " +
      "WHERE Pracownicy.ID in (?) AND YEAR(Data) = ? " +
      "AND MONTH(Data) = ?";

    queryDatabase(query, [employeesID, year, month], (error, results) => {
      if (error) {
        reject(error);
      } else {
        console.log(results);
        resolve(results);
      }
    });
  });
};

module.exports = {
  SentECPToDatabase,
  checkECPForEmployeeOnDate,
  getAbsencesForMonth,
};
