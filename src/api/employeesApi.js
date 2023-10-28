import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/employees`;

export const subordinatesApi = async (id) => {
  try {
    const response = await axios.get(API_URL, { params: { id } });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};

export const supervisorsApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/supervisors`, {});
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z serwera:", error);
    throw error;
  }
};

export const hoursWorkedApi = async (employeeId, month) => {
  try {
    const response = await axios.get(`${API_URL}/worked-hours-by-employee`, {
      params: {
        employeeId: employeeId,
        month: month,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z serwera:", error);
    throw error;
  }
};
export const infApi = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/inf`, {
      params: {
        employeeId: employeeId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z serwera:", error);
    throw error;
  }
};
export const allEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {});
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z serwera:", error);
    throw error;
  }
};

export const addEmployee = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};

export const mySupervisorsAPI = async (myID) => {
  try {
    const response = await axios.get(`${API_URL}/mySupervisors`, {
      params: {
        myID: myID,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z serwera:", error);
    throw error;
  }
};
