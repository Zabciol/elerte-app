import React, { useState, useEffect } from "react";
import { getRequestsApi } from "../../../api/requestsApi";
import RequestsList from "./RequestsList";

const ManageRequests = ({ user }) => {
  const [request, setRequests] = useState([]);
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
      <RequestsList requests={request} />
    </div>
  );
};

export default ManageRequests;
