import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/position`;

export const positionApi = async (id) => {
  console.log("Przekazywane id:" + id);
  try {
    const response = await axios.get(API_URL, {
      params: {
        Dzial_ID: id,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("API not available");
  }
};
