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
  var dzialy = props.subordinates.map((item) => item.Dzial);
  dzialy = Array.from(new Set(dzialy));

  const [dzial, setDzial] = useState(dzialy[0]);
  const [date, setDate] = useState(getDateYearMonthDay());
  const changeDate = (event) => {
    setDate(event.target.value);
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

  return (
    <>
      <div className='controls'>
        <LoadingButton></LoadingButton>
      </div>
      <ECPList subordinates={props.subordinates} dzial={dzial} />
    </>
  );
};

export default ECP;
