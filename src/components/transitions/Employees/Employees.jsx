import React, { useState, useEffect } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import EmployeesList from "./EmployeesList";
import EmployeeInf from "./EmployeeInf";
import NewEmployee from "./NewEmployee/NewEmployee";
import ExportExcel from "./ExportExcel";
import EmployeeAbsenceInf from "./EmployeeAbsenceInf";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { allEmployeesAPI } from "../../../api/employeesApi";
import { useAuth } from "../Login/AuthContext";

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
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [dzialy, setDzialy] = useState([]);
  const [dzial, setDzial] = useState();
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [employees, setEmployees] = useState(subordinates);
  const [filteredSubordinates, setFilteredSubordinates] =
    useState(subordinates);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const getEmployees = async () => {
    try {
      const data =
        user.Uprawnienia === 2 || user.Uprawnienia === 4
          ? await allEmployeesAPI()
          : subordinates;
      setEmployees(data);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    const noweDzialy = Array.from(new Set(employees.map((item) => item.Dzial)));
    setDzialy(noweDzialy);
    setDzial(noweDzialy[0]);
  }, [employees]);

  useEffect(() => {
    if (employees.length) {
      const newFilteredSubordinates =
        dzial === "Każdy"
          ? employees
          : employees.filter((employee) => employee.Dzial === dzial);
      setFilteredSubordinates(newFilteredSubordinates);
    }
  }, [dzial, employees]);

  useEffect(() => {
    getEmployees();
  }, [user, subordinates]);

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

  const [key, setKey] = useState("Lista");

  return (
    <Tabs
      id='controlled-tab-example'
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className='mb-3'>
      <Tab eventKey='Lista' title='Lista'>
        <EmployeesList
          subordinates={filteredSubordinates}
          dzial={dzial}
          user={user}
          date={date}
          showWorkedHours={true}>
          <EmployeeInf user={user} />
        </EmployeesList>
      </Tab>
      <Tab eventKey='Nieobecnosci' title='Nieobecności'>
        <EmployeesList subordinates={filteredSubordinates} date={date}>
          {" "}
          <EmployeeAbsenceInf date={date} />
        </EmployeesList>
      </Tab>
      <Tab eventKey='Excel' title='Export'>
        {" "}
        <ExportExcel
          subordinates={employees}
          user={user}
          dzial={dzial}
          date={date}
        />
      </Tab>
      <Tab
        eventKey='Nowy'
        title='Nowy'
        disabled={
          user.Uprawnienia === 3 || user.Uprawnienia === 4 ? false : true
        }>
        <NewEmployee dzial={dzial} />
      </Tab>
    </Tabs>
  );
};

export default Employees;
