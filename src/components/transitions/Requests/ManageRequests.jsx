import React, { useState, useEffect } from "react";
import { getRequestsApi } from "../../../api/requestsApi";
import RequestsList from "./RequestsList";
import RequestMail from "./RequestMail";

const ManageRequests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);
  const getRequests = async () => {
    const data = await getRequestsApi(user.ID);
    console.log(data.message);
    console.log(data.data);
    setRequests(data.data);
  };
  useEffect(() => {
    getRequests();
  }, []);
  return (
    <div className='requests-manage'>
      <RequestsList requests={requests} setRequest={setRequest} />
      {request !== null ? (
        <RequestMail
          sender={request}
          reciver={user}
          readOnly={true}
          reasons={[request.Nazwa]}
          startDate={request.Data_Od}
          endDate={request.Data_Do}
          message={request.Wiadomosc}
        />
      ) : (
        <p>Proszę wybrać</p>
      )}
    </div>
  );
};

export default ManageRequests;
