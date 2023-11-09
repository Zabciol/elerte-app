const db = require("../db");
const { queryDatabase } = require("../db");
const { queryDatabasePromise } = require("../db");
const ExcelJS = require("exceljs");

const getRecordsByDateAndEmployeeId = async (date, employeeIds) => {
  return await queryDatabasePromise(
    "SELECT * FROM ECP WHERE Data = ? AND Pracownik_ID IN (?)",
    [date, employeeIds]
  );
};

const findExistingRecords = async (records, date) => {
  //const date = records[0].date;
  const employeeIds = records.map((r) => r.employeeID);
  return await getRecordsByDateAndEmployeeId(date, employeeIds);
};

const updateRecordInDB = async (record, editDate, editUser) => {
  return await queryDatabasePromise(
    "UPDATE ECP SET Od_godz = ?, Do_godz = ?, IloscGodzin = ?, Powod_ID = ?, DataZapisu = ?, ID_Edytora = ? WHERE Data = ? AND Pracownik_ID = ?",
    [
      record.Od_Godz,
      record.Do_Godz,
      record.hours,
      record.reason,
      editDate,
      editUser,
      record.date,
      record.employeeID,
    ]
  );
};

const insertRecordsInDB = async (toInsert, editDate, editUser) => {
  const insertData = toInsert.map((record) => [
    record.date,
    record.Od_Godz,
    record.Do_Godz,
    record.employeeID,
    record.reason,
    record.hours,
    editDate,
    editUser,
  ]);
  return await queryDatabasePromise(
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
        toUpdate.map((record) => updateRecordInDB(record, editDate, editUser))
      );
    }

    if (toInsert.length > 0) {
      await insertRecordsInDB(toInsert, editDate, editUser);
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

const getECPForMonth = async (date, employeesID) => {
  const [year, month] = date.split("-");

  const query =
    "SELECT Pracownicy.ID, Imie, Nazwisko,Mail,Dzialy.Nazwa AS `Dzial`, " +
    "Stanowisko.Nazwa AS `Stanowisko`, IloscGodzin, ECP.Od_godz, ECP.Do_godz, " +
    "WymiarPracy.Od AS `WymiarOd`, WymiarPracy.`Do` AS `WymiarDo`, " +
    "PowodyNieobecnosci.Nazwa AS `Powod`, `Data` FROM ECP LEFT JOIN Pracownicy ON Pracownicy.ID = ECP.Pracownik_ID " +
    "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = ECP.Powod_ID " +
    "LEFT JOIN WymiarPracy ON WymiarPracy.ID = Pracownicy.WymiarPracy_ID " +
    "LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID " +
    "LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
    "WHERE Pracownicy.ID in (?) AND YEAR(Data) = ? " +
    "AND MONTH(Data) = ?";

  return await queryDatabasePromise(query, [employeesID, year, month]);

  /*
  return new Promise((resolve, reject) => {
    const query =
      "SELECT Pracownicy.ID, Imie, Nazwisko,Mail,Dzialy.Nazwa AS `Dzial`, " +
      "Stanowisko.Nazwa AS `Stanowisko`, IloscGodzin, ECP.Od_godz, ECP.Do_godz, " +
      "WymiarPracy.Od AS `WymiarOd`, WymiarPracy.`Do` AS `WymiarDo`, " +
      "PowodyNieobecnosci.Nazwa AS `Powod`, `Data` FROM ECP LEFT JOIN Pracownicy ON Pracownicy.ID = ECP.Pracownik_ID " +
      "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = ECP.Powod_ID " +
      "LEFT JOIN WymiarPracy ON WymiarPracy.ID = Pracownicy.WymiarPracy_ID " +
      "LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID " +
      "LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
      "WHERE Pracownicy.ID in (?) AND YEAR(Data) = ? " +
      "AND MONTH(Data) = ?";

    queryDatabase(query, [employeesID, year, month], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
  */
};

const exportECPForMonth = async (date, employeesID, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ECP");
    const ecp = await getECPForMonth(date, employeesID);
    console.log(ecp);

    worksheet.columns = [
      { header: "Imie", key: "imie" },
      { header: "Nazwisko", key: "nazwisko" },
      { header: "Mail", key: "mail" },
      { header: "Stanowisko", key: "stanowisko" },
      { header: "Dział", key: "dzial" },
      { header: "Od Godziny", key: "od" },
      { header: "Do Godziny", key: "do" },
      { header: "Ilośc godzin w ciągu dnia", key: "godziny" },
      { header: "Data", key: "data" },
      { header: "Powód nieobecności", key: "powod" },
    ];

    if (ecp && ecp.length !== 0) {
      for (var i = 0; i < ecp.length; i++) {
        worksheet.addRow({
          imie: ecp[i].Imie,
          nazwisko: ecp[i].Nazwisko,
          mail: ecp[i].Mail,
          stanowisko: ecp[i].Stanowisko,
          dzial: ecp[i].Dzial,
          od: ecp[i].Od_godz,
          do: ecp[i].Do_godz,
          godziny: ecp[i].IloscGodzin,
          data: ecp[i].Data,
          powod: ecp[i].Powod,
        });
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=ECP.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
  }
};

const getAbsenceNotIncludeRequests = async (date, IDs) => {
  try {
    const [year, month] = date.split("-");
    const query =
      "SELECT Pracownicy.ID, Pracownicy.Imie, Pracownicy.Nazwisko, ECP.`Data`, " +
      "ECP.Od_godz, ECP.Do_godz, ECP.IloscGodzin, PowodyNieobecnosci.Nazwa AS `Powod`, " +
      "Dzialy.Nazwa AS `Dzial`, Stanowisko.Nazwa AS `Stanowisko` " +
      "FROM ECP LEFT JOIN Pracownicy ON Pracownicy.ID = ECP.Pracownik_ID " +
      "LEFT JOIN PowodyNieobecnosci ON ECP.Powod_ID = PowodyNieobecnosci.ID " +
      "LEFT JOIN Stanowisko ON Pracownicy.Stanowisko_ID = Stanowisko.ID " +
      "LEFT JOIN Dzialy ON Stanowisko.Dzial_ID = Dzialy.ID " +
      "WHERE ECP.IloscGodzin < 8 AND YEAR(Data) = ? " +
      "AND MONTH(Data) = ? AND PracowniCY.ID in (?) AND NOT EXISTS ( " +
      "SELECT 1 FROM Wnioski W WHERE W.Nadawca_ID = ECP.Pracownik_ID " +
      "AND W.Status = 'Zaakceptowano' AND ECP.Data BETWEEN W.Data_Od AND W.Data_Do)";
    const results = await queryDatabasePromise(query, [year, month, IDs]);
    console.log("Nieobecności uzyskano pomyślnie!");
    return { success: true, message: "Pozyskano nieobecności", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania nieobecności:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  SentECPToDatabase,
  checkECPForEmployeeOnDate,
  getECPForMonth,
  exportECPForMonth,
  getAbsenceNotIncludeRequests,
};
