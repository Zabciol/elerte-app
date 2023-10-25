import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import { getCurrentDateYearMonthDay } from "../../common/CommonFunctions";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";
import { GetDataProvider } from "./ECPDataContext";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
      <Form.Control
        type='date'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
};

const ECP = ({ user, setMenuItems, subordinates }) => {
  const dzialy = Array.from(new Set(subordinates.map((item) => item.Dzial)));
  const [dzial, setDzial] = useState(dzialy[0]);
  const [date, setDate] = useState(getCurrentDateYearMonthDay());

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
      />
    );
  }, [dzial, date]);

  return (
    <GetDataProvider>
      <ECPList
        user={user}
        subordinates={[user, ...subordinates]}
        dzial={dzial}
        date={date}
      />
    </GetDataProvider>
  );
};

export default ECP;
