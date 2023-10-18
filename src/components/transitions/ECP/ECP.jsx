import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import LoadingButton from "../../common/LoadingBtn";
import { getDateYearMonthDay } from "../../common/Variables";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <NavDropdown title={dzial} id='basic-nav-dropdown'>
        {dzialy.map((item) => (
          <NavDropdown.Item key={item} onClick={() => setDzial(item)}>
            {item}
          </NavDropdown.Item>
        ))}

        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => setDzial("Kazdy")}>
          Każdy
        </NavDropdown.Item>
      </NavDropdown>

      <Form.Control
        type='date'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
};

const ECP = (props) => {
  const [employeesECP, setEmployeesECP] = useState([]);
  var dzialy = props.subordinates.map((item) => item.Dzial);
  dzialy = Array.from(new Set(dzialy));
  const [dzial, setDzial] = useState(dzialy[0]);
  console.log(dzial);
  const [date, setDate] = useState(getDateYearMonthDay());
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const save = () => {
    console.log(employeesECP);
  };

  const addToECP = (newItem) => {
    setEmployeesECP((prevECP) => {
      const index = prevECP.findIndex(
        (item) => item.employee === newItem.employee
      );

      if (index === -1) {
        return [...prevECP, newItem];
      } else {
        const existingItem = prevECP[index];
        if (JSON.stringify(existingItem) === JSON.stringify(newItem)) {
          return prevECP; // jeśli element nie zmienił się, zwróć poprzedni stan
        }
        return [
          ...prevECP.slice(0, index),
          newItem,
          ...prevECP.slice(index + 1),
        ];
      }
    });
  };

  useEffect(() => {
    props.setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
      />
    );
  }, [dzial, date]);

  useEffect(() => {
    console.log(employeesECP);
  }, [employeesECP]);

  useEffect(() => {
    setEmployeesECP([]);
  }, [dzial]);

  return (
    <>
      <div className='controls'>
        <h4>Lista ECP</h4>
        <LoadingButton onClick={save}></LoadingButton>
      </div>
      <ECPList
        subordinates={props.subordinates}
        dzial={dzial}
        setEmployeesECP={setEmployeesECP}
        addToECP={addToECP}
        employeesECP={employeesECP}
      />
    </>
  );
};

export default ECP;
