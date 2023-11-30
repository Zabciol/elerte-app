import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/ecp`;

export const SentECPToDatabase = async (data) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.post(`${API_URL}/SentECPToDatabase`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const checkECPForEmployeeOnDate = async (employeeId, date) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(
      `${API_URL}/checkECP/${employeeId}/${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getECPAPI = async (data, employeesID) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/ecp`, {
      params: {
        date: data,
        employeesID: employeesID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const exportECPAPI = async (data, employeesID, department) => {
  try {
    //Tworzy nazwe
    let date1 = new Date();
    const year = date1.getFullYear();
    const month = date1.getMonth() + 1; // Dodaje 1, aby uzyskać prawidłowy miesiąc
    const day = date1.getDate(); // Używa getDate() zamiast getDay()
    const hours = date1.getHours().toString().padStart(2, "0");
    const minutes = date1.getMinutes().toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0"); // Dodaje wiodące zero jeśli potrzeba
    const formattedDay = day.toString().padStart(2, "0"); // Dodaje wiodące zero jeśli potrzeba

    const fileName = `${year}-${formattedMonth}-${formattedDay}_${hours}-${minutes}_${department}`;

    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/export`, {
      params: {
        date: data,
        employeesID: employeesID,
        fileName: fileName,
      },
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      }, // Dodano, aby oczekiwać odpowiedzi w formie bloba
    });

    // Tworzy URL dla bloba
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${fileName}.xlsx`); // nazwa pliku, którą chcesz
    document.body.appendChild(link);
    link.click();
    link.remove(); // Czyści DOM z niepotrzebnego już linku
  } catch (error) {
    handleError(error);
  }
};
export const getAbsenceAPI = async (data, employeesID) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/absence`, {
      params: {
        date: data,
        employeesID: employeesID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fillECPforDeletedEmployeeApi = async (data) => {
  try {
    console.log("FROM API: ", data);
    const token = sessionStorage.getItem("userToken");
    const response = await axios.post(
      `${API_URL}/fillECPforDeletedEmployee`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAbsenceCountAPI = async (employeeID, data) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/countAbsence`, {
      params: {
        date: data,
        employeeID: employeeID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
