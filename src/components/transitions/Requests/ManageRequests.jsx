import React, { useState, useEffect } from "react";
import {
  getRequestsApi,
  acceptRequestsApi,
  declineRequestsApi,
} from "../../../api/requestsApi";
import RequestsList from "./RequestsList";
import RequestMail from "./RequestMail";
import LoadingButton from "../../common/LoadingBtn";
import { useAuth } from "../Login/AuthContext";

const ManageRequests = ({ user }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);
  const [sender, setSender] = useState({});
  const [reason, setReason] = useState({ Nazwa: "" });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 767);

  const getRequests = async () => {
    try {
      const data = await getRequestsApi(user.ID);
      console.log(data.message);
      setRequests(data.data);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    if (request !== null) {
      const person = {
        Imie: request.Imie,
        Nazwisko: request.Nazwisko,
        Mail: request.Mail,
      };
      const reason = { Nazwa: request.Powod };
      setSender(person);
      setReason(reason);
    }
  }, [request]);

  useEffect(() => {
    getRequests();
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderRequestMail = () => (
    <RequestMail
      sender={sender}
      reciver={user}
      readOnly={true}
      reason={reason}
      reasons={[reason]}
      startDate={request.Data_Od}
      endDate={request.Data_Do}
      message={request.Wiadomosc}
      setRequest={setRequest}
      request={request}>
      <div className='request-manage_btns'>
        <LoadingButton
          action={() => declineRequestsApi(request)}
          buttonText={"Odrzuć"}
        />
        <LoadingButton
          action={() => acceptRequestsApi(request)}
          buttonText={"Zaakceptuj"}
        />
      </div>
    </RequestMail>
  );

  return (
    <div className='requests-manage'>
      {isMobileView ? (
        request === null ? (
          <RequestsList
            requests={requests}
            setRequest={setRequest}
            setRequests={setRequests}
          />
        ) : (
          renderRequestMail()
        )
      ) : (
        <>
          <RequestsList
            requests={requests}
            setRequest={setRequest}
            setRequests={setRequests}
          />
          <div className='requests-manage-mail'>
            {request !== null ? renderRequestMail() : <p>Proszę wybrać</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageRequests;
