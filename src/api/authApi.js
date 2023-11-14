import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/users`;

export const loginApi = async (login, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { login, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyTokenApi = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const changePasswordApi = async (
  oldPassword,
  newPassword,
  newPasswordRepeat,
  userID
) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.put(
      `${API_URL}/changePassword`,
      {
        oldPassword,
        newPassword,
        newPasswordRepeat,
        userID,
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
