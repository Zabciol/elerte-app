const { queryDatabase, queryDatabasePromise } = require("../db");
const countOfEmployeesOnPosition = async (positionID, dateArray) => {
  try {
    // Generowanie serii dat
    const datesForSQL = dateArray
      .map((date) => `SELECT '${date}-01' AS StartOfMonth`)
      .join(" UNION ALL ");

    const query = `
      WITH DateSeries AS (
        ${datesForSQL}
      ),
      UniqueEmployeeCounts AS (
        SELECT
          YEAR(ECP.Data) AS Rok,
          MONTH(ECP.Data) AS Miesiac,
          Pracownicy.ID
        FROM 
          Pracownicy 
        JOIN 
          ECP ON ECP.Pracownik_ID = Pracownicy.ID 
        WHERE 
          Pracownicy.Stanowisko_ID = ?
        GROUP BY 
          YEAR(ECP.Data), MONTH(ECP.Data), Pracownicy.ID
      )
      SELECT 
        YEAR(DateSeries.StartOfMonth) AS Rok,
        MONTH(DateSeries.StartOfMonth) AS Miesiac,
        COALESCE(COUNT(UniqueEmployeeCounts.ID), 0) AS 'Count'
      FROM 
        DateSeries
      LEFT JOIN 
        UniqueEmployeeCounts ON YEAR(DateSeries.StartOfMonth) = UniqueEmployeeCounts.Rok AND MONTH(DateSeries.StartOfMonth) = UniqueEmployeeCounts.Miesiac
      GROUP BY 
        YEAR(DateSeries.StartOfMonth), MONTH(DateSeries.StartOfMonth);
    `;

    return await queryDatabasePromise(query, positionID);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  countOfEmployeesOnPosition,
};
