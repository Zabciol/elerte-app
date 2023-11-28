import React, { useState, useEffect, useMemo } from "react";
import Form from "react-bootstrap/Form";
import { SelectItems } from "../../layout/Menu/MenuForms";
import { getCurrentDateYearMonthDay } from "../../common/CommonFunctions";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";
import { GetDataProvider } from "./ECPDataContext";
import { getNextWorkDay } from "../../common/CommonFunctions";
import Search from "../../layout/Menu/Search";

const MenuItems = React.memo(
  ({ date, setDate, dzial, dzialy, setDzial, searchValue, setSearchValue }) => {
    return (
      <>
        <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        <SelectItems item={dzial} items={dzialy} setItem={setDzial} />
        <Form.Control
          type='date'
          value={date}
          onChange={setDate}
          className='menu-select'
        />
      </>
    );
  }
);

const ECP = ({ user, setMenuItems, subordinates }) => {
  const dzialy = Array.from(new Set(subordinates.map((item) => item.Dzial)));
  const [dzial, setDzial] = useState(dzialy[0]);
  const [date, setDate] = useState(getCurrentDateYearMonthDay());
  const [searchValue, setSearchValue] = useState("");

  const changeDate = (event) => {
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 7);
    const inserted = new Date(event.target.value);
    if (inserted < today && inserted > twoDaysAgo) {
      setDate(event.target.value);
    }
  };

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={dzial}
        dzialy={dzialy}
        setDzial={setDzial}
        date={date}
        setDate={changeDate}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    );
  }, [dzial, date, searchValue]);

  useEffect(() => {
    setSearchValue("");
  }, [dzial]);

  return (
    <GetDataProvider>
      <ECPList
        user={user}
        subordinates={subordinates}
        dzial={dzial}
        date={date}
        searchValue={searchValue}
      />
    </GetDataProvider>
  );
};

export default ECP;
