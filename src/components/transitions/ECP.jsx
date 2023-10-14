import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Variables from "../common/Variables";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <NavDropdown
        title={dzial}
        onClick={(event) => {
          event.stopPropagation();
        }}
        id='basic-nav-dropdown'>
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
      <Form
        onClick={(event) => {
          event.stopPropagation();
        }}>
        <Form.Control
          type='date'
          value={date}
          className='me-2'
          aria-label='Miesiąc'
          onChange={setDate}
        />
      </Form>
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

  return <div>ECP</div>;
};

export default ECP;
