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

const findExistingRecords = async (records) => {
  const date = records[0].date;
  const employeeIds = records.map((r) => r.employeeID);
  return await getRecordsByDateAndEmployeeId(date, employeeIds);
};

const updateRecordInDB = async (record) => {
  return await queryDatabaseAsync(
    "UPDATE ECP SET Od_godz = ?, Do_godz = ?, IloscGodzin = ?, Powod_ID = ? WHERE Data = ? AND Pracownik_ID = ?",
    [
      record.Od_Godz,
      record.Do_Godz,
      record.hours,
      record.reason,
      record.date,
      record.employeeID,
    ]
  );
};

const insertRecordsInDB = async (toInsert) => {
  const insertData = toInsert.map((record) => [
    record.date,
    record.Od_Godz,
    record.Do_Godz,
    record.employeeID,
    record.reason,
    record.hours,
  ]);
  return await queryDatabaseAsync(
    "INSERT INTO ECP (Data, Od_godz, Do_godz, Pracownik_ID, Powod_ID, IloscGodzin) VALUES ?",
    [insertData]
  );
};

exports.SentECPToDatabase = async (records) => {
  try {
    const existingRecords = await findExistingRecords(records);
    const toUpdate = [];
    const toInsert = [];

    for (const record of records) {
      const found = existingRecords.some(
        (er) => er.Data === record.date && er.Pracownik_ID === record.employeeID
      );
      if (found) {
        toUpdate.push(record);
      } else {
        toInsert.push(record);
      }
    }

    if (toUpdate.length > 0) {
      await Promise.all(toUpdate.map(updateRecordInDB));
    }

    if (toInsert.length > 0) {
      await insertRecordsInDB(toInsert);
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

exports.checkECPForEmployeeOnDate = async (employeeId, date) => {
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
