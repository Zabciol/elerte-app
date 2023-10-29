const { queryDatabase } = require("../db");
const { queryDatabasePromise } = require("../db");

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
      "Pracownicy.Mail, Wnioski.Powod_ID, PowodyNieobecnosci.Nazwa, Wnioski.Data_Od, Wnioski.Data_Do, Wnioski.`Status`, Wnioski.Wiadomosc " +
      "FROM Wnioski " +
      "LEFT JOIN Pracownicy ON Pracownicy.ID = Wnioski.Nadawca_ID " +
      "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = Wnioski.Powod_ID " +
      "WHERE Wnioski.Odbiorca_ID = ?";

    const results = await queryDatabasePromise(query, id);
    console.log("Wniosek uzyskano pomyślnie!");
    return { success: true, message: "Pozyskano wnioski", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sentRequest,
  getRequests,
};
