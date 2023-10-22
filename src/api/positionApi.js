import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/position`;

export const positionApi = async (id) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        Dzial_ID: id,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};