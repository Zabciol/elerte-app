import React, { useState, useEffect } from "react";
import { mySupervisorsAPI } from "../../../api/employeesApi";
const NewRequest = (props) => {
  const [mySupervisors, setMySupervisors] = useState([]);
  const [mySupervisor, setMySupervisor] = useState();
  const getMySupervisors = async () => {
    const data = await mySupervisorsAPI(props.user.ID);
    console.log(data);
    setMySupervisors(data);
    setMySupervisor(data[0]);
  };

  useEffect(() => {
    getMySupervisors();
  }, []);
  return <div>NewRequest</div>;
};

export default NewRequest;
