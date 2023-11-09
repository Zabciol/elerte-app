import axios from "axios";
import Variables from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/requests`;

export const newRequestApi = async (data) => {
  try {
    const token = sessionStorage.getItem("userToken");
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
    const token = sessionStorage.getItem("userToken");
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
    const token = sessionStorage.getItem("userToken");
    console.log(id);
    const response = await axios.put(`${API_URL}/updateView`, {
      ID: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
export const accpetRequestsApi = async (request) => {
  try {
    const token = sessionStorage.getItem("userToken");
    console.log(request);
    const response = await axios.put(`${API_URL}/accept`, {
      ID: request.ID,
      request: request,
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
export const declineRequestsApi = async (request) => {
  try {
    const token = sessionStorage.getItem("userToken");
    console.log(request);
    const response = await axios.put(`${API_URL}/decline`, {
      ID: request.ID,
      request: request,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
export const getAcceptedRequestsApi = async (date, employeesIDs) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/getAccepted`, {
      params: {
        date: date,
        IDs: employeesIDs,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
};
