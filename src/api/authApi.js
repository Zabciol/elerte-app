import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/users`;

export const loginApi = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data || "Błąd podczas pobierania danych z API"
      );
    } else if (error.request) {
      throw new Error("Brak odpowiedzi od serwera");
    } else {
      throw new Error("API not available");
    }
  }
};

export const verifyTokenApi = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data || "Błąd podczas pobierania danych z API"
      );
    } else if (error.request) {
      throw new Error("Brak odpowiedzi od serwera");
    } else {
      throw new Error("API not available");
    }
  }
};
