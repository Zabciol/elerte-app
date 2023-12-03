import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/analitics`;

export const countOfEmployeesOnPositionApi = async (positionID, dates) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/countEmployeesOnPosition`, {
      params: {
        positionID: positionID,
        dates: dates,
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
