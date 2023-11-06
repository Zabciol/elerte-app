import React, { useState, useEffect } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import EmployeesList from "./EmployeesList";
import EmployeeInf from "./EmployeeInf";
import NewEmployee from "./NewEmployee/NewEmployee";
import ExportExcel from "./ExportExcel";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";

const MenuItems = ({ dzial, dzialy, setDzial, date, setDate }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
      <Form.Control
        type='month'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
};

const Employees = ({ user, setMenuItems, subordinates }) => {
  const [dzialy, setDzialy] = useState([]);
  const [dzial, setDzial] = useState();
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [employees, setEmployees] = useState([...subordinates]);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
      />
    );
  }, [dzial, date, dzialy]);

  useEffect(() => {
    const noweDzialy = Array.from(
      new Set(subordinates.map((item) => item.Dzial))
    );
    setDzialy(noweDzialy);
    setDzial(noweDzialy[0]);
  }, [subordinates]);

  const [key, setKey] = useState("Lista");

  return (
    <Tabs
      id='controlled-tab-example'
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className='mb-3'>
      <Tab eventKey='Lista' title='Lista'>
        <EmployeesList
          subordinates={subordinates}
          dzial={dzial}
          user={user}
          date={date}>
          <EmployeeInf />
        </EmployeesList>
      </Tab>
      <Tab eventKey='Urlopy' title='Urlopy'>
        Tab content for Contact
      </Tab>
      <Tab
        eventKey='Nowy'
        title='Nowy'
        //</Tabs>disabled={user.Dzial === "Księgowość" ? false : true}
      >
        <NewEmployee dzial={dzial} />
      </Tab>
      <Tab eventKey='Excel' title='Exportuj'>
        {" "}
        <ExportExcel
          subordinates={subordinates}
          user={user}
          dzial={dzial}
          date={date}
        />
      </Tab>
    </Tabs>
  );
};

export default Employees;
