import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `http://localhost:${Variables.port}/requests`;

export const newRequestApi = async (data) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.post(`${API_URL}/new`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const getRequestsApi = async (myID) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/get`, {
      params: {
        myID: myID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const updateRequestsView = async (id) => {
  try {
    const token = sessionStorage.getItem("userToken");
    console.log(id);
    const response = await axios.put(
      `${API_URL}/updateView`,
      {
        ID: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const acceptRequestsApi = async (request) => {
  try {
    const response = await axios.get(
      `${API_URL}/accept?token=${encodeURIComponent(request.token)}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const declineRequestsApi = async (request) => {
  try {
    const response = await axios.get(
      `${API_URL}/decline?token=${encodeURIComponent(request.token)}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
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
    handleError(error);
  }
};
