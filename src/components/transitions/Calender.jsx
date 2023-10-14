import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Variables from "../common/Variables";

const MenuItems = ({ date, setDate }) => {
  return (
    <Form
      onClick={(event) => {
        event.stopPropagation();
      }}>
      <Form.Control
        type='month'
        value={date}
        className='me-2'
        aria-label='Miesiąc'
        onChange={setDate}
      />
    </Form>
  );
};

const Calender = (props) => {
  const [date, setDate] = useState(Variables.dateYearMonth);
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    props.setMenuItems(
      <MenuItems date={date} setDate={changeDate}></MenuItems>
    );
  }, [date]);
  return <div>Calender</div>;
};

export default Calender;
