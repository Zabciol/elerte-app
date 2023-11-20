import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/workingtime`;

export const workingTimeApi = async () => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const holidaysApi = async (data) => {
  try {
    const date = new Date(data);
    console.log(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/holidays`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        year: year,
        month: month,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
