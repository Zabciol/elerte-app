const { queryDatabase } = require("../db");

const queryDatabasePromise = (query, data) => {
  return new Promise((resolve, reject) => {
    queryDatabase(query, data, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const sentRequest = async (request) => {
  try {
    console.log(request);

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
    console.error("Wystąpił błąd podczas zapisywania hasła:", error);
    return { success: false, message: error.message }; // Możesz także zwrócić błąd tutaj
  }
};

module.exports = {
  sentRequest,
};
