import React, { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { updateRequestsView } from "../../../api/requestsApi";
import { useAuth } from "../Login/AuthContext";

const RequestsList = ({ requests, setRequest, setRequests }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const handleChangeRequest = async (request) => {
    if (request.Wyswietlone === "nie") {
      console.log("Tu się zmieni status czy wyświetlone");
      try {
        await updateRequestsView(request.ID);
      } catch (error) {
        setMessage(error.message);
        setShowPopUpLogout(true);
      }

      const newRequests = requests.map((item) => {
        if (item.ID === request.ID) {
          return { ...item, Wyswietlone: "tak" };
        }
        return item;
      });
      setRequests(newRequests);
    }
    setRequest((prevRequest) =>
      prevRequest && prevRequest.ID === request.ID ? null : request
    );
  };

  return (
    <div className='requests-manage_list'>
      <ListGroup requests-manage_list>
        {[...requests].reverse().map((request) => (
          <ListGroup.Item
            key={request.ID}
            as='li'
            className='d-flex justify-content-between align-items-start requests-manage_list-item '
            onClick={() => handleChangeRequest(request)}>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>
                {request.Imie + " " + request.Nazwisko}
              </div>
              {request.Data_Od + " / " + request.Data_Do} {request.Status}
            </div>
            {request.Wyswietlone === "nie" ? (
              <Badge
                bg='primary'
                pill
                className='requests-manage_list-item_badge'>
                New
              </Badge>
            ) : null}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default RequestsList;
