import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { reasonsApi } from "../../../api/reasonsApi";
import { mySupervisorAPI } from "../../../api/employeesApi";
import { newRequestApi } from "../../../api/requestsApi";
import RequestMail from "./RequestMail";
import LoadingButton from "../../common/LoadingBtn";
import { useAuth } from "../Login/AuthContext";

const NewRequest = ({ user }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [mySupervisor, setMySupervisor] = useState();
  const [reasons, setReasons] = useState([]);
  const [reason, setReason] = useState({});
  const [message, setMessageHere] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const getMySupervisor = async () => {
    setLoading(true);
    const data = await mySupervisorAPI(user.ID);
    setMySupervisor(data);
    setLoading(false);
  };
  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      setReasons(data.data);
      setReason(data.data[0].ID);
    } catch (error) {
      console.log(
        error.message || "Nie udało się uzyskać powodów nieobecności"
      );
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const changeReason = (e) => {
    const index = e.target.value;
    const selectedReason = reasons[index];
    console.log(selectedReason);
    setReason(selectedReason);
  };

  const sentRequest = async () => {
    console.log(reasons);
    console.log(reason);
    const request = {
      senderID: user.ID,
      reciverID: mySupervisor.ID,
      message: message,
      reasonID: reason,
      dataOd: startDate,
      dataDo: endDate,
    };

    console.log("Sending");
    console.log(request);
    try {
      const response = await newRequestApi(request);
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getMySupervisor();
    getReasons();
  }, []);
  return (
    <>
      {!loading && mySupervisor ? (
        <RequestMail
          sender={user}
          reciver={mySupervisor}
          reasons={reasons}
          reason={reason}
          setReason={setReason}
          readOnly={false}
          message={message}
          setMessage={setMessageHere}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}>
          <LoadingButton action={sentRequest} buttonText={"Wyslij"} />
        </RequestMail>
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
