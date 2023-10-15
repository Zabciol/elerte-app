import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Variables from "../../common/Variables";
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
      <input
        type='date'
        value={date}
        onChange={setDate}
        className='menu-select'></input>
    </>
  );
};

const ECP = (props) => {
  var dzialy = props.subordinates.map((item) => item.Dzial);
  dzialy = Array.from(new Set(dzialy));

  const [dzial, setDzial] = useState(dzialy[0]);
  const [date, setDate] = useState(Variables.dateYearMonthDay);
  const changeDate = (event) => {
    setDate(event.target.value);
  };
  console.log(dzialy);
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

  return (
    <>
      <ECPList subordinates={props.subordinates} dzial={dzial} />
    </>
  );
};

export default ECP;
