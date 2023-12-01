import axios from "axios";
import Variables from "../components/common/CommonFunctions";
import { handleError } from "../components/common/CommonFunctions";

const API_URL = `${Variables.host}:${Variables.port}/departments`;

export const departmentsApi = async () => {
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

export const addDepartmentApi = async (newDepartment) => {
  try {
    if (newDepartment.name === "") throw new Error("Wprowadz poprawne dane");
    const token = sessionStorage.getItem("userToken");
    const response = await axios.post(`${API_URL}/add`, newDepartment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const showDepartmentAPI = async (departmentName) => {
  try {
    const token = sessionStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/show`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        department: departmentName,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
