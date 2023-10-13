import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";

const Calender = (props) => {
  const menuItems = (
    <>
      <Form
        className='menu-item'
        onClick={(event) => {
          event.stopPropagation();
        }}>
        <Form.Control
          type='month'
          placeholder='Search'
          className='me-2'
          aria-label='Miesiąc'
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
