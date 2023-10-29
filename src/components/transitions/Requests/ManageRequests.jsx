import React, { useState, useEffect } from "react";
import { getRequestsApi } from "../../../api/requestsApi";
import RequestsList from "./RequestsList";
import RequestMail from "./RequestMail";

const ManageRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);
  const [sender, setSender] = useState({});
  const [reason, setReason] = useState();
  const getRequests = async () => {
    const data = await getRequestsApi(user.ID);
    console.log(data.message);
    console.log(data.data);
    setRequests(data.data);
  };

  useEffect(() => {
    if (request !== null) {
      const person = {
        Imie: request.Imie,
        Nazwisko: request.Nazwisko,
        Mail: request.Mail,
      };
      const reason = [request.Powod];
      setSender(person);
      setReason(reason);
    }
  }, [request]);

  useEffect(() => {
    getRequests();
  }, []);
  return (
    <div className='requests-manage'>
      <RequestsList requests={requests} setRequest={setRequest} />
      <div className='requests-manage-mail'>
        {request !== null ? (
          <RequestMail
            sender={sender}
            reciver={user}
            readOnly={true}
            reasons={[request]}
            startDate={request.Data_Od}
            endDate={request.Data_Do}
            message={request.Wiadomosc}
          />
        ) : (
          <p>Proszę wybrać</p>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
