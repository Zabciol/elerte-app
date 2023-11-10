import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/ecp`;

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
export const exportECPAPI = async (data, employeesID) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/export`, {
      params: {
        date: data,
        employeesID: employeesID,
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
    link.setAttribute("download", "ECP.xlsx"); // nazwa pliku, którą chcesz
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
