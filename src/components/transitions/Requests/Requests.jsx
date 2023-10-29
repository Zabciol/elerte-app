import React, { useState } from "react";
import NewRequest from "./NewRequest";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
const Requests = ({ user }) => {
  return (
    <Tabs defaultActiveKey='box' id='uncontrolled-tab-example' className='mb-3'>
      <Tab eventKey='box' title='Skrzynka'>
        Lista wniosków
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
