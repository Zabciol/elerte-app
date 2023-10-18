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

exports.updateOrCreate = async (records) => {
  try {
    const existingRecords = await queryDatabaseAsync(
      "SELECT Data, Pracownik_ID FROM ECP WHERE Data IN (?) AND Pracownik_ID IN (?)",
      [records.map((r) => r.data), records.map((r) => r.employee)]
    );

    const toUpdate = [];
    const toInsert = [];

    for (const record of records) {
      const found = existingRecords.some(
        (er) => er.Data === record.data && er.Pracownik_ID === record.employee
      );
      if (found) {
        toUpdate.push(record);
      } else {
        toInsert.push(record);
      }
    }

    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(async (record) => {
          await queryDatabaseAsync(
            "UPDATE ECP SET Od_godz = ?, Do_godz = ?, IloscGodzin = ?, Powod_ID = ? WHERE Data = ? AND Pracownik_ID = ?",
            [
              record.odGodz,
              record.doGodz,
              record.iloscGodzin,
              record.powod,
              record.data,
              record.employee,
            ]
          );
        })
      );
    }

    if (toInsert.length > 0) {
      const insertData = toInsert.map((record) => [
        record.data,
        record.odGodz,
        record.doGodz,
        record.employee,
        record.powod,
        record.iloscGodzin,
      ]);
      await queryDatabaseAsync(
        "INSERT INTO ECP (Data, Od_godz, Do_godz, Pracownik_ID, Powod_ID, IloscGodzin) VALUES ?",
        [insertData]
      );
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
