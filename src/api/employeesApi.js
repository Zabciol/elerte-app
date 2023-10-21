import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/employees`;

export const subordinatesApi = async (id) => {
  try {
    const response = await axios.get(API_URL, { params: { id } });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};
export const getHoursWorked = async (employeeId, month) => {
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
export const getInf = async (employeeId) => {
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
