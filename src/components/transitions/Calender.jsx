import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

const Calender = (props) => {
  const [date, setDate] = useState(props.date);
  const changeDate = (event) => {
    setDate(event.target.value);
  };
  const menuItems = (
    <>
      <Form
        className='menu-item'
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
  });
  return <div>Calender</div>;
};

export default Calender;
