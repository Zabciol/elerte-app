import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import { getDateYearMonthDay } from "../../common/Variables";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";
import { GetDataProvider, useGetData } from "./ECPDataContext";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <NavDropdown title={dzial} id='basic-nav-dropdown'>
        {dzialy.map((item) => (
          <NavDropdown.Item key={item} onClick={() => setDzial(item)}>
            {item}
          </NavDropdown.Item>
        ))}
        <Dropdown.Divider />
        <NavDropdown.Item onClick={() => setDzial("Każdy")}>
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
  const [reasons, setReasons] = useState([]);
  const [dzialy, setDzialy] = useState([]);
  const [dzial, setDzial] = useState("");
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

  useEffect(() => {
    var dzialy = props.subordinates.map((item) => item.Dzial);
    dzialy = Array.from(new Set(dzialy));
    setDzialy(dzialy);
    setDzial(dzialy[0]);
  }, []);

  return (
    <GetDataProvider>
      <ECPList
        subordinates={props.subordinates}
        dzial={dzial}
        reasons={reasons}
        date={date}
      />
    </GetDataProvider>
  );
};

export default ECP;
