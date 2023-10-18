import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import LoadingButton from "../../common/LoadingBtn";
import { getDateYearMonthDay } from "../../common/Variables";
import { reasonsApi } from "../../../api/reasonsApi";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";
import { updateOrCreateECP } from "../../../api/ecpApi";

const MenuItems = ({ date, setDate, dzial, dzialy, setDzial }) => {
  return (
    <>
      <NavDropdown title={dzial} id='basic-nav-dropdown'>
        {dzialy.map((item) => (
          <NavDropdown.Item key={item} onClick={() => setDzial(item)}>
            {item}
          </NavDropdown.Item>
        ))}
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
  const [employeesECP, setEmployeesECP] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [dzialy, setDzialy] = useState([]);
  const [dzial, setDzial] = useState("");
  const [date, setDate] = useState(getDateYearMonthDay());
  const changeDate = (event) => {
    setDate(event.target.value);
  };

  const save = () => {
    console.log(employeesECP);
  };

  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      console.log(data.message);
      setReasons(data.data);
    } catch (error) {
      console.log(error.message || "Login failed. Please try again.");
    }
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
    getReasons();
  }, []);

  useEffect(() => {
    setEmployeesECP([]);
  }, [dzial]);

  return (
    <>
      <div className='controls'>
        <h4>Lista ECP</h4>
        <LoadingButton
          action={updateOrCreateECP}
          data={employeesECP}
          buttonText='Zapisz do serwera'></LoadingButton>
      </div>
      <ECPList
        subordinates={props.subordinates}
        dzial={dzial}
        setEmployeesECP={setEmployeesECP}
        employeesECP={employeesECP}
        reasons={reasons}
        date={date}
      />
    </>
  );
};

export default ECP;
