import axios from "axios";
import Variables from "../components/common/Variables";

const API_URL = `http://localhost:${Variables.port}/employees`;

export const loginApi = async (email, password) => {
  try {
    const response = await axios.get(`${API_URL}/`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};
