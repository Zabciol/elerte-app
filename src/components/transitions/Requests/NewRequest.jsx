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
  const [mySupervisors, setMySupervisors] = useState();
  const [mySupervisorID, setMySupervisorID] = useState();
  const [reasons, setReasons] = useState([]);
  const [reason, setReason] = useState({});
  const [message, setMessageHere] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const getMySupervisors = async () => {
    try {
      setLoading(true);
      const data = await mySupervisorAPI(user.ID);
      console.log(data.message);
      setMySupervisors(data.data);
      setMySupervisorID(data.data[0].ID);
      setLoading(false);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
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

  const sentRequest = async () => {
    const request = {
      senderID: user.ID,
      reciverID: mySupervisorID,
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
    getMySupervisors();
    getReasons();
  }, []);
  return (
    <>
      {!loading && mySupervisorID ? (
        <RequestMail
          sender={user}
          reciver={mySupervisorID}
          setReciver={setMySupervisorID}
          recivers={mySupervisors}
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
