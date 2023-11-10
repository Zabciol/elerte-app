import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/workingtime`;

export const workingTimeApi = async () => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(API_URL, {
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
