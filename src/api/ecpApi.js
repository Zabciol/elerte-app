import axios from "axios";
import Variables from "../components/common/Variables";

const API_URL = `http://localhost:${Variables.port}/ecp`;

export const SentECPToDatabase = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/SentECPToDatabase`, data);
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
export const checkECPForEmployeeOnDate = async (employeeId, date) => {
  try {
    const response = await axios.get(
      `${API_URL}/checkECP/${employeeId}/${date}`
    );

    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
