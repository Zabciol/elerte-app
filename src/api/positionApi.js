import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/position`;

export const positionApi = async (id) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(API_URL, {
      params: {
        Dzial_ID: id,
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

export const addPositionApi = async (newPosition) => {
  try {
    if (newPosition.name === "" || newPosition.Dzial_ID === null)
      throw new Error("Wprowadz poprawne dane");
    const token = sessionStorage.getItem("userToken");
    const response = await axios.post(`${API_URL}/add`, newPosition, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
