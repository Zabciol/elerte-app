import React, { useState, useEffect } from "react";
import { getRequestsApi } from "../../../api/requestsApi";

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
  return <div>ManageRequests</div>;
};

export default ManageRequests;
