import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Variables from "../common/Variables";

const Calender = (props) => {
  const [date, setDate] = useState(Variables.dateYearMonth);
  const changeDate = (event) => {
    setDate(event.target.value);
  };
  const menuItems = (
    <>
      <Form
        onClick={(event) => {
          event.stopPropagation();
        }}>
        <Form.Control
          type='month'
          value={date}
          className='me-2'
          aria-label='Miesiąc'
          onChange={changeDate}
        />
      </Form>
    </>
  );

  useEffect(() => {
    props.setMenuItems(menuItems);
  }, []);
  return <div>Calender</div>;
};

export default Calender;
