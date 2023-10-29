import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";

const RequestsList = ({ requests, setRequest }) => {
  return (
    <div className='requests-manage_list'>
      <ListGroup>
        {requests.map((request) => (
          <ListGroup.Item
            as='li'
            className='d-flex justify-content-between align-items-start'
            onClick={() => setRequest(request)}>
            <div className='ms-2 me-auto'>
              <div className='fw-bold'>
                {request.Imie + " " + request.Nazwisko}
              </div>
              {request.Data_Od + " / " + request.Data_Do}
            </div>
            <Badge bg='primary' pill>
              New
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default RequestsList;
