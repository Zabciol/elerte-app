import React, { useEffect, useState } from "react";
import NewRequest from "./NewRequest";
import ManageRequests from "./ManageRequests";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "../../../styles/Request.css";
const Requests = ({ user, setMenuItems }) => {
  useEffect(() => {
    setMenuItems(<></>);
  }, []);
  return (
    <Tabs defaultActiveKey='new' id='uncontrolled-tab-example' className='mb-3'>
      <Tab eventKey='box' title='Skrzynka' disabled={!user.supervisor}>
        <ManageRequests user={user} />
      </Tab>

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
