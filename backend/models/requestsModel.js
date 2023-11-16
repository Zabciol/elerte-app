const { queryDatabase, queryDatabasePromise, getSecretKey } = require("../db");
const nodemailer = require("nodemailer");
const employeeModel = require("./employeesModel");
const reasonsModel = require("./reasonsModel");
const jwt = require("jsonwebtoken");
const config = require("../config");

//Konfiguracja wysyłki maila
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "noreply@elerte.pl", // Twoja nazwa użytkownika Office 365
    pass: "lmsnhkgzylyqlhxz", // Twoje hasło Office 365
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sentMail = async (request, token) => {
  try {
    const sender = await employeeModel.getEmployeeCasualInf(request.senderID);
    const reciver = await employeeModel.getEmployeeCasualInf(request.reciverID);
    const reason = await reasonsModel.getReasonByID(request.reasonID);

    const API_URL = `${config.protocol}://${config.dbConnectionStr.host}:${config.port}/requests`;
    //const API_URL = `${config.api}/requests`;
    const acceptLink = `${API_URL}/accept?token=${token}`;
    const declineLink = `${API_URL}/decline?token=${token}`;

    const requestMessage =
      request.message !== "" ? " </br> Wiadomość: " + request.message : "";
    const message =
      " <p>Witaj, <br/> " +
      sender.Imie +
      " " +
      sender.Nazwisko +
      " wysłał do ciebie wniosek w aplikacji Elerte ECP.  <br/>" +
      "Na następujący termin: " +
      "<br/>od: " +
      request.dataOd +
      "<br/>do: " +
      request.dataDo +
      "<br/>Powód: " +
      reason.Powod +
      requestMessage +
      "<br/><br/><br/><br/><a href=" +
      acceptLink +
      " style='background-color: #007bff; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;'>Akceptuj</a>" +
      " <a href=" +
      declineLink +
      " style='background-color: #dc3545; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;'>Odrzuć</a><br/></p>";

    const mailOptions = {
      from: "noreply@elerte.pl", // adres nadawcy
      //to: reciver.Mail, // lista odbiorców
      //dev
      to: "jan.zaborowicz@elerte.pl",
      subject: "Urlop", // Temat wiadomości
      text: message, // treść wiadomości w formie tekstowej
      html: message, // treść wiadomości w formie HTML
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      }
    });
  } catch (error) {
    throw error;
  }
};
const sentRequest = async (request) => {
  try {
    await queryDatabase("START TRANSACTION");
    if (
      !(await checkIfIsEntitledToLeave(
        request.senderID,
        request.dataOd,
        request.dataDo
      ))
    ) {
      console.log("Masz za mało dni urlopowych");
      throw Error("Masz za mało dni urlopowych");
    }

    const insertData = [
      request.senderID,
      request.reciverID,
      request.message,
      request.reasonID,
      request.dataOd,
      request.dataDo,
      "Oczekujący",
    ];
    const insertQuery =
      "INSERT INTO Wnioski (Nadawca_ID,Odbiorca_ID,Wiadomosc,Powod_ID,Data_Od ,Data_Do,`Status`) VALUES (?)";
    const selectQuery = "SELECT LAST_INSERT_ID() as lastId";

    await queryDatabasePromise(insertQuery, [insertData]);
    const result = await queryDatabasePromise(selectQuery);
    const requestId = result[0].lastId;

    const token = jwt.sign(
      { id: requestId, data_od: request.dataOd },
      getSecretKey(),
      {
        expiresIn: "7d",
      }
    );

    const insertTokenQuery = "UPDATE Wnioski SET token = ? WHERE ID = ?";
    await queryDatabasePromise(insertTokenQuery, [token, requestId]);
    await sentMail(request, token);
    await queryDatabase("COMMIT");
    return { success: true, message: "Wysłano wniosek", requestId: requestId };
  } catch (error) {
    console.error("Wystąpił błąd podczas wysyłania wniosku", error);
    await queryDatabase("ROLLBACK");
    return { success: false, message: error.message };
  }
};

const checkIfIsEntitledToLeave = async (userID, dataOd, dataDo) => {
  try {
    const first = new Date(dataOd);
    const second = new Date(dataDo);
    const roznicaMilisekundy = Math.abs(second - first);
    const difference = Math.floor(roznicaMilisekundy / (24 * 60 * 60 * 1000));
    const query =
      "SELECT PozostalyUrlopTegoRoku as `Ilosc` FROM Pracownicy WHERE ID = ?";
    const results = await queryDatabasePromise(query, userID);
    if (results[0].Ilosc >= difference) {
      console.log("Moze wysłać");
      return true;
    } else {
      console.log("Nie moze wysłać");
      return false;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getRequests = async (id) => {
  try {
    const query =
      "SELECT Wnioski.ID, Wnioski.Odbiorca_ID, Wnioski.Nadawca_ID, Pracownicy.Imie, Pracownicy.Nazwisko, " +
      "Pracownicy.Mail, Wnioski.Powod_ID, PowodyNieobecnosci.Nazwa AS `Powod`, Wnioski.Data_Od, " +
      "Wnioski.Data_Do, Wnioski.`Status`, Wnioski.Wiadomosc, Wnioski.Wyswietlone, Wnioski.token " +
      "FROM Wnioski " +
      "LEFT JOIN Pracownicy ON Pracownicy.ID = Wnioski.Nadawca_ID " +
      "LEFT JOIN PowodyNieobecnosci ON PowodyNieobecnosci.ID = Wnioski.Powod_ID " +
      "WHERE Wnioski.Odbiorca_ID = ? AND Wnioski.Data_Od > CURDATE()";

    const results = await queryDatabasePromise(query, id);
    return { success: true, message: "Pozyskano wnioski", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const getRequestByID = async (id) => {
  try {
    const query = "SELECT * from Wnioski WHERE ID = ?";
    const results = await queryDatabasePromise(query, id);
    return { success: true, message: "Pozyskano wniosek", data: results[0] };
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
    return { success: true, message: "Updated request view", data: results };
  } catch (error) {
    console.error("Wystąpił błąd podczas pozyskiwania wniosków:", error);
    throw error;
    return { success: false, message: error.message };
  }
};

const acceptRequests = async (id) => {
  try {
    await queryDatabase("START TRANSACTION");
    const requestInf = await getRequestByID(id);

    await deleteECP(requestInf.data);

    await fillECP(requestInf.data);

    const changeStatusQuery =
      "UPDATE Wnioski SET `Status` = 'Zaakceptowano' WHERE ID = ?";
    const results = await queryDatabasePromise(changeStatusQuery, id);
    await queryDatabase("COMMIT");
    return {
      success: true,
      message: "Wniosek zaakceptowano pomyślnie!",
      data: results,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas akceptowania wniosku:", error);
    await queryDatabase("ROLLBACK");
    throw error;
    return { success: false, message: error.message };
  }
};

const declineRequests = async (id) => {
  try {
    const query = "UPDATE Wnioski SET `Status` = 'Odrzucono' WHERE ID = ?";
    const results = await queryDatabasePromise(query, id);
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
    throw error;
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
      message: "Dane z wniosku w ECP zostały usunięte.",
      affectedRows: deleteResults.affectedRows,
    };
  } catch (error) {
    console.error("Wystąpił błąd podczas usuwania ecp:", error);
    throw error;
    return { success: false, message: error.message };
  }
};
const getAcceptedRequests = async (date, IDs) => {
  //Wykorzystywane do nieobecności pracownika w miesiącu
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
  getRequestByID,
};
