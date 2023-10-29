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
export const getRequestsApi = async (myID) => {
  try {
    const response = await axios.get(`${API_URL}/get`, {
      params: {
        myID: myID,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
export const updateRequestsView = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/updateView`, {
      params: {
        ID: id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
