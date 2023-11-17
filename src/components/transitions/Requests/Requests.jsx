import React, { useState } from "react";
import NewRequest from "./NewRequest";
import ManageRequests from "./ManageRequests";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../../styles/Request.css";
const Requests = ({ user }) => {
  return (
    <Tabs defaultActiveKey='new' id='uncontrolled-tab-example' className='mb-3'>
      {user.supervisor ? (
        <Tab eventKey='box' title='Skrzynka'>
          <ManageRequests user={user} />
        </Tab>
      ) : null}
      <Tab
        eventKey='new'
        title='Nowy Wniosek'
        disabled={user.ID === 1 ? true : false}>
        <NewRequest user={user} />
      </Tab>
    </Tabs>
  );
};

export default Requests;
