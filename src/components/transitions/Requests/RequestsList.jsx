import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { updateRequestsView } from "../../../api/requestsApi";

const RequestsList = ({ requests, setRequest, setRequests }) => {
  console.log(requests);
  const handleChangeRequest = async (request) => {
    if (request.Wyswietlone === "nie") {
      console.log("Tu się zmieni status czy wyświetlone");
      //await updateRequestsView(request.ID);

      const newRequests = requests.map((item) => {
        if (item.ID === request.ID) {
          return { ...item, Wyswietlone: "tak" };
        }
        return item;
      });
      setRequests(newRequests);
      setRequest(request);
    }
  };
  return (
    <div className='requests-manage_list'>
      <ListGroup>
        {requests.map((request) => (
          <ListGroup.Item
            as='li'
            className='d-flex justify-content-between align-items-start'
            onClick={() => handleChangeRequest(request)}>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>
                {request.Imie + " " + request.Nazwisko}
              </div>
              {request.Data_Od + " / " + request.Data_Do}
            </div>
            {request.Wyswietlone === "nie" ? (
              <Badge bg='primary' pill>
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
