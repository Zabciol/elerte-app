import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";

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
        <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        {menukey !== "Nowy" && (
          <SelectItems item={dzial} items={dzialy} setItem={setDzial} />
        )}
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

  const [dzialy, setDzialy] = useState([
    ...new Set(subordinates.map((e) => e.Dzial)),
  ]);
  const [dzial, setDzial] = useState(dzialy[0]);

  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [employees, setEmployees] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [delayedSearchValue, setDelayedSearchValue] = useState(searchValue);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let newEmployees;
        if (hasAdminView(user) || hasAdminPermissions(user)) {
          newEmployees = await allEmployeesAPI();
        } else {
          newEmployees = subordinates;
        }
        setEmployees(newEmployees);
      } catch (error) {
        setMessage(error.message);
        setShowPopUpLogout(true);
      }
    };

    fetchEmployees();
  }, [user, subordinates]);

  const noweDzialy = useMemo(
    () => Array.from(new Set(employees.map((e) => e.Dzial))),
    [employees]
  );

  useEffect(() => {
    if (noweDzialy.length > 0) {
      setDzial(noweDzialy[0]);
    }
  }, [noweDzialy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedSearchValue(searchValue);
    }, 500); // Opóźnienie 0,5 sekundy

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const filteredSubordinates = useMemo(() => {
    let result = employees;

    if (delayedSearchValue) {
      result = result.filter(
        (employee) =>
          employee.Imie.toLowerCase().includes(
            delayedSearchValue.toLowerCase()
          ) ||
          employee.Nazwisko.toLowerCase().includes(
            delayedSearchValue.toLowerCase()
          )
      );
    }

    if (dzial !== "Każdy") {
      result = result.filter((e) => e.Dzial === dzial);
    }

    return result;
  }, [dzial, employees, delayedSearchValue]);

  const changeDate = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={noweDzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
        menukey={key}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    );
  }, [dzial, date, noweDzialy, key, searchValue, setMenuItems]);

  return (
    <Tabs
      id='controlled-tab-example'
      activeKey={key}
      onSelect={setKey}
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
        disabled={!hasAdminView(user) && !subordinates.length}>
        <EmployeesList subordinates={filteredSubordinates} date={date}>
          <EmployeeAbsenceInf date={date} menukey={key} />
        </EmployeesList>
      </Tab>
      <Tab
        eventKey='Excel'
        title='Export'
        disabled={!hasAdminView(user) && !subordinates.length}>
        <ExportExcel
          subordinates={filteredSubordinates}
          user={user}
          dzial={dzial}
          date={date}
        />
      </Tab>
      <Tab eventKey='Nowy' title='Nowy' disabled={!hasAdminPermissions(user)}>
        <NewMain />
      </Tab>
    </Tabs>
  );
};

export default Employees;
