import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { reasonsApi } from "../../../api/reasonsApi";
import { mySupervisorAPI } from "../../../api/employeesApi";
import NewRequestForm from "./NewRequestForm";
import "../../../styles/Request.css";
const NewRequest = ({ user }) => {
  const [mySupervisor, setMySupervisor] = useState();
  const [reasons, setReasons] = useState([]);
  const [reason, setReason] = useState(null);
  const [loading, setLoading] = useState(true);
  const getMySupervisor = async () => {
    setLoading(true);
    const data = await mySupervisorAPI(user.ID);
    console.log(data);
    setMySupervisor(data);
    setLoading(false);
  };
  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      console.log(data.data);
      setReasons(data.data);
      setReason(data.data[0]);
    } catch (error) {
      console.log(
        error.message || "Nie udało się uzyskać powodów nieobecności"
      );
    }
  };

  const changeReason = (e) => {
    const index = e.target.value;
    const selectedReason = reasons[index];
    console.log(selectedReason);
    setReason(selectedReason);
  };

  useEffect(() => {
    getMySupervisor();
    getReasons();
  }, []);
  return (
    <>
      {!loading && mySupervisor ? (
        <NewRequestForm
          user={user}
          mySupervisor={mySupervisor}
          reasons={reasons}
          reason={reason}
          setReason={changeReason}
        />
      ) : (
        <div>
          <p>Trwa ładowanie</p>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        </div>
      )}
    </>
  );
};

export default NewRequest;
