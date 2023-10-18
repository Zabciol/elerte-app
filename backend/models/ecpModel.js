const db = require("../db");

exports.updateOrCreate = async (records) => {
  // Pobierz istniejące rekordy
  const existingRecords = await db.query(
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

  // Aktualizuj istniejące rekordy
  if (toUpdate.length > 0) {
    await Promise.all(
      toUpdate.map(async (record) => {
        await db.query(
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

  // Wstaw nowe rekordy
  if (toInsert.length > 0) {
    const insertData = toInsert.map((record) => [
      record.data,
      record.odGodz,
      record.doGodz,
      record.employee,
      record.powod,
      record.iloscGodzin,
    ]);
    await db.query(
      "INSERT INTO ECP (Data, Od_godz, Do_godz, Pracownik_ID, Powod_ID, IloscGodzin) VALUES ?",
      [insertData]
    );
  }

  return {
    updated: toUpdate.length,
    inserted: toInsert.length,
    message: "Poprawnie wysłano ECP",
  };
};
