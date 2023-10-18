import axios from "axios";
import Variables from "../components/common/Variables";

const API_URL = `http://localhost:${Variables.port}/ecp`;

export const inputEcpApi = async (ecp) => {
  try {
    const response = await axios.post(`${API_URL}/updateOrCreate`, { ecp });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};
