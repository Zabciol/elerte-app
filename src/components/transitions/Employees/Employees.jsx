import React, { useState, useEffect, useCallback } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import EmployeesList from "./EmployeesList";
import EmployeeInf from "./EmployeeInf";
import ExportExcel from "./ExportExcel";
import EmployeeAbsenceInf from "./EmployeeAbsenceInf";
import NewMain from "./New/NewMain";
import Search from "../../layout/Menu/Search";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { allEmployeesAPI } from "../../../api/employeesApi";
import { useAuth } from "../Login/AuthContext";

const hasAdminPermissions = (user) =>
  user.Uprawnienia === 3 || user.Uprawnienia === 4;

const hasAdminView = (user) => user.Uprawnienia === 2 || user.Uprawnienia === 4;

const MenuItems = React.memo(
  ({
    dzial,
    dzialy,
    setDzial,
    date,
    setDate,
    menukey,
    searchValue,
    setSearchValue,
  }) => {
    return (
      <>
        <Search
          searchValue={searchValue}
          setSearchValue={setSearchValue}></Search>
        {menukey !== "Nowy" ? (
          <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
        ) : null}
        <Form.Control
          type='month'
          value={date}
          onChange={setDate}
          className='menu-select'
        />
      </>
    );
  }
);

const Employees = ({ user, setMenuItems, subordinates }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [key, setKey] = useState("Lista");
  const [dzialy, setDzialy] = useState(subordinates.map((e) => e.Dzial));
  const [dzial, setDzial] = useState(dzialy[0]);
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [employees, setEmployees] = useState([]);
  const [filteredSubordinates, setFilteredSubordinates] =
    useState(subordinates);
  const [searchValue, setSearchValue] = useState("");

  const changeDate = useCallback(
    (event) => {
      setDate(event.target.value);
    },
    [setDate]
  );
  const getEmployees = useCallback(async () => {
    try {
      if (hasAdminView(user) || hasAdminPermissions(user))
        setEmployees(await allEmployeesAPI());
      else {
        setEmployees(subordinates);
      }
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  }, [user, subordinates]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    console.log(employees);
    if (employees.length > 0) {
      const noweDzialy = Array.from(
        new Set(
          hasAdminView(user) || hasAdminPermissions
            ? employees.map((e) => e.Dzial)
            : subordinates.map((e) => e.Dzial)
        )
      );
      setDzialy(noweDzialy);
      setDzial(noweDzialy[0]);
    }
  }, [employees, user, key]);

  const filterByDepartment = (employees) => {
    if (employees.length) {
      const newFilteredSubordinates =
        dzial === "Każdy"
          ? employees
          : employees.filter((e) => e.Dzial === dzial);
      setFilteredSubordinates(newFilteredSubordinates);
    }
  };

  useEffect(() => {
    setSearchValue("");
    filterByDepartment(employees);
  }, [dzial]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = employees.filter(
        (employee) =>
          employee.Imie.toLowerCase().includes(searchValue) ||
          employee.Nazwisko.toLowerCase().includes(searchValue)
      );
      filterByDepartment(filtered);
    }, 500);

    return () => clearTimeout(timeoutId); // Wyczyszczenie timeoutu przy zmianie searchValue
  }, [searchValue]);

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
        menukey={key}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    );
  }, [dzial, date, dzialy, key, searchValue]);
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
          <EmployeeInf user={user} menukey={key} />
        </EmployeesList>
      </Tab>
      <Tab
        eventKey='Nieobecnosci'
        title='Nieobecności'
        disabled={hasAdminView(user) || subordinates.length ? false : true}>
        <EmployeesList subordinates={filteredSubordinates} date={date}>
          {" "}
          <EmployeeAbsenceInf date={date} menukey={key} />
        </EmployeesList>
      </Tab>
      <Tab
        eventKey='Excel'
        title='Export'
        disabled={hasAdminView(user) || subordinates.length ? false : true}>
        {" "}
        <ExportExcel
          subordinates={filteredSubordinates}
          user={user}
          dzial={dzial}
          date={date}
        />
      </Tab>
      <Tab
        eventKey='Nowy'
        title='Nowy'
        disabled={hasAdminPermissions ? false : true}>
        <NewMain dzial={dzial} />
      </Tab>
    </Tabs>
  );
};

export default Employees;
