import axios from "axios";
import Variables from "../components/common/Variables";

const API_URL = `http://localhost:${Variables.port}/ecp`;

export const updateOrCreateECP = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:${Variables.port}/ecp`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
