import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/users`;

export const loginApi = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};
