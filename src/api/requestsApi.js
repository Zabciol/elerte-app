import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/requests`;

export const newRequestApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/new`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
