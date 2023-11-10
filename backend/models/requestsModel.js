const { queryDatabase, queryDatabasePromise } = require("../db");

const sentRequest = async (request) => {
  try {
    const insertData = [
      request.senderID,
      request.reciverID,
      request.message,
      request.reasonID,
      request.dataOd,
      request.dataDo,
      "Oczekujący",
    ];
    const query =
      "INSERT INTO Wnioski (Nadawca_ID,Odbiorca_ID,Wiadomosc,Powod_ID,Data_Od ,Data_Do,`Status`) VALUES (?)";

    await queryDatabasePromise(query, [insertData]);
    console.log("Wniosek dodany pomyślnie!");
    return { success: true, message: "Wysłano wniosek" };
  } catch (error) {
    console.error("Wystąpił błąd podczas wysyłania wniosku", error);
    return { success: false, message: error.message };
  }
};
const getRequests = async (id) => {
  try {
    const query =
      "SELECT Wnioski.ID, Wnioski.Odbiorca_ID, Wnioski.Nadawca_ID, Pracownicy.Imie, Pracownicy.Nazwisko, " +
      "Pracownicy.Mail, Wnioski.Powod_ID, PowodyNieobecnosci.Nazwa AS `Powod`, Wnioski.Data_Od, " +
      "Wnioski.Data_Do, Wnioski.`Status`, Wnioski.Wiadomosc, Wnioski.Wyswietlone " +
      "FROM Wnioski " +
      "LEFT JOIN Pracownicy ON Pracownicy.ID = Wnioski.Nadawca_ID " +
      "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = Wnioski.Powod_ID " +
      "WHERE Wnioski.Odbiorca_ID = ? AND Wnioski.Data_Od > CURDATE()";

    const results = await queryDatabasePromise(query, id);
    console.log("Wniosek uzyskano pomyślnie!");
    return { success: true, message: "Pozyskano wnioski", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    throw error;
    return { success: false, message: error.message };
  }
};
const updateRequestsView = async (id) => {
  try {
    const query = "UPDATE Wnioski SET Wyswietlone = 'tak' WHERE ID = ?";

    const results = await queryDatabasePromise(query, id);
    console.log("Wniosek zaktualizowano pomyślnie!");
    return { success: true, message: "Updated request view", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const acceptRequests = async (id) => {
  try {
    const query = "UPDATE Wnioski SET `Status` = 'Zaakceptowano' WHERE ID = ?";
    const results = await queryDatabasePromise(query, id);
    console.log("Updated request status on accept");
    return {
      success: true,
      message: "Wniosek zaakceptowano pomyślnie!",
      data: results,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas akceptowania wniosku:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const declineRequests = async (id) => {
  try {
    const query = "UPDATE Wnioski SET `Status` = 'Odrzucono' WHERE ID = ?";
    const results = await queryDatabasePromise(query, id);
    console.log(" Updated request status on decline");
    return {
      success: true,
      message: "Wniosek odrzucono pomyślnie!",
      data: results,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas odrzucania wniosku:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const fillECP = async (request) => {
  try {
    const startDate = new Date(request.Data_Od);
    const endDate = new Date(request.Data_Do);
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const editorID = request.Odbiorca_ID;
    const recordsToInsert = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = date.toISOString().split("T")[0];
      recordsToInsert.push([
        formattedDate,
        "00:00",
        "00:00",
        request.Nadawca_ID,
        request.Powod_ID,
        0,
        currentDate,
        editorID,
      ]);
    }

    const query =
      "INSERT INTO ECP (`Data`,`Od_godz`,`Do_Godz`, `Pracownik_ID`, `Powod_ID`,`IloscGodzin`,`DataZapisu`, `ID_Edytora`) VALUES ?";
    const results = await queryDatabasePromise(query, [recordsToInsert]);
    return {
      success: true,
      message: "ECP dodano pomyślnie",
      data: results,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas dodawania ecp:", error);
    return { success: false, message: error.message };
  }
};
const deleteECP = async (request) => {
  try {
    const query = `
      DELETE FROM ECP
      WHERE Pracownik_ID = ? AND Data >= ? AND Data <= ?
    `;

    const deleteResults = await queryDatabasePromise(query, [
      request.Nadawca_ID,
      request.Data_Od,
      request.Data_Do,
    ]);

    return {
      success: true,
      message: "Wniosek odrzucony, dane usunięte.",
      affectedRows: deleteResults.affectedRows,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas usuwania ecp:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const getAcceptedRequests = async (date, IDs) => {
  try {
    const [year, month] = date.split("-");
    const query =
      "SELECT Pracownicy.ID, Pracownicy.Imie, Pracownicy.Nazwisko, Stanowisko.Nazwa AS `Stanowisko` , Dzialy.Nazwa AS `Dzial`, " +
      "PowodyNieobecnosci.Nazwa AS `Powod`, Wnioski.Data_Od,Wnioski.Data_Do, " +
      "Akceptujacy.Imie AS `ImieAkceptujacego`, " +
      "Akceptujacy.Nazwisko AS `NazwiskoAkceptujacego` " +
      "FROM Pracownicy LEFT JOIN Stanowisko ON Stanowisko.ID = Pracownicy.Stanowisko_ID " +
      "LEFT JOIN Dzialy ON Dzialy.ID = Stanowisko.Dzial_ID " +
      "LEFT JOIN Wnioski ON Pracownicy.ID = Wnioski.Nadawca_ID " +
      "LEFT JOIN PowodyNieobecnosci ON Wnioski.Powod_ID = PowodyNieobecnosci.ID " +
      "LEFT JOIN Pracownicy AS Akceptujacy ON Wnioski.Odbiorca_ID = Akceptujacy.ID " +
      "WHERE Wnioski.`Status` = 'Zaakceptowano' " +
      "AND (MONTH(Wnioski.Data_Od) = ? OR MONTH(Wnioski.Data_Do) = ?) " +
      "AND (YEAR(Wnioski.Data_Od) = ? OR YEAR(Wnioski.Data_Do) = ?) AND " +
      "Wnioski.Nadawca_ID IN (?);";

    const results = await queryDatabasePromise(query, [
      month,
      month,
      year,
      year,
      IDs,
    ]);
    console.log("Wnioski uzyskano pomyślnie!");
    return { success: true, message: "Pozyskano wnioski", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

module.exports = {
  sentRequest,
  getRequests,
  updateRequestsView,
  acceptRequests,
  declineRequests,
  fillECP,
  deleteECP,
  getAcceptedRequests,
};
