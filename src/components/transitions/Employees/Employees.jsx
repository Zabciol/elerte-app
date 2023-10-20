import React, { useState, useEffect } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import EmployeesList from "./EmployeesList";

const MenuItems = ({ dzial, dzialy, setDzial }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
    </>
  );
};

const Employees = ({ user, setMenuItems, subordinates }) => {
  const dzialy = Array.from(new Set(subordinates.map((item) => item.Dzial)));
  const [dzial, setDzial] = useState(dzialy[0]);
  useEffect(() => {
    setMenuItems(
      <MenuItems dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
    );
  }, []);

  const [key, setKey] = useState("Lista");

  return (
    <Tabs
      id='controlled-tab-example'
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className='mb-3'>
      <Tab eventKey='Lista' title='Lista'>
        <EmployeesList subordinates={subordinates} dzial={dzial} user={user} />
      </Tab>
      <Tab eventKey='Nowy' title='Nowy'>
        Tab content for Profile
      </Tab>
      <Tab eventKey='contact' title='Contact' disabled>
        Tab content for Contact
      </Tab>
    </Tabs>
  );
};

export default Employees;
