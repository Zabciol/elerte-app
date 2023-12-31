import React, { useState, useEffect, useMemo } from "react";
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
import { useAuth } from "../Login/AuthContext";
import { isAdmin, canEdit, hasView } from "../../common/CommonFunctions";

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
          <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
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
  const [dzial, setDzial] = useState(subordinates[0]?.Dzial || "");
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [searchValue, setSearchValue] = useState("");
  const [delayedSearchValue, setDelayedSearchValue] = useState(searchValue);

  const dzialy = useMemo(
    () => Array.from(new Set(subordinates.map((e) => e.Dzial))),
    [subordinates]
  );

  useEffect(() => {
    if (dzialy.length > 0) {
      setDzial(dzialy[0]);
    }
  }, [dzialy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedSearchValue(searchValue);
    }, 500); // Opóźnienie 0,5 sekundy

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const filteredSubordinates = useMemo(() => {
    let result = subordinates;

    // Filtruje pracowników na podstawie imienia i nazwiska
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

    // Grupuje pracowników według działu jeśli dzial === 'Każdy', w przeciwnym razie filtruje według wybranego działu
    if (dzial === "Każdy") {
      result = result.reduce((acc, current) => {
        const dept = current.Dzial;
        if (!acc[dept]) {
          acc[dept] = [];
        }
        acc[dept].push(current);
        return acc;
      }, {});
    } else {
      result = result.filter((e) => e.Dzial === dzial);
    }
    return result;
  }, [dzial, subordinates, delayedSearchValue]);

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
        menukey={key}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    );
  }, [dzial, date, dzialy, key, searchValue, setMenuItems]);

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
          dzialy={dzialy}
          user={user}
          date={date}
          showWorkedHours={true}>
          <EmployeeInf user={user} menukey={key} />
        </EmployeesList>
      </Tab>
      <Tab
        eventKey='Nieobecnosci'
        title='Nieobecności'
        disabled={!hasView(user) && !subordinates.length}>
        <EmployeesList
          subordinates={filteredSubordinates}
          date={date}
          dzial={dzial}
          dzialy={dzialy}
          showWorkedHours={false}>
          <EmployeeAbsenceInf date={date} menukey={key} />
        </EmployeesList>
      </Tab>
      <Tab
        eventKey='Excel'
        title='Export'
        disabled={!hasView(user) && !subordinates.length}>
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
        disabled={!isAdmin(user) && !canEdit(user)}>
        <NewMain />
      </Tab>
    </Tabs>
  );
};

export default Employees;
