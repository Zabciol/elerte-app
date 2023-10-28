import React, { useState, useEffect } from "react";
import { mySupervisorsAPI } from "../../../api/employeesApi";
const NewRequest = (props) => {
  const [mySupervisors, setMySupervisors] = useState([]);
  const getMySupervisors = async () => {
    const data = await mySupervisorsAPI(props.user.ID);
    console.log(data);
    setMySupervisors(data);
  };

  useEffect(() => {
    getMySupervisors();
  }, []);
  return <div>NewRequest</div>;
};

export default NewRequest;
