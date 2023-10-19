import React, { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import LoadingButton from "../../common/LoadingBtn";
import { getDateYearMonthDay } from "../../common/Variables";
import { reasonsApi } from "../../../api/reasonsApi";
import ECPList from "./ECPList";
import "./../../../styles/ECP.css";
import { updateOrCreateECP } from "../../../api/ecpApi";
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

  const { collectors, collectAll } = useGetData();

  const gatherDataAndSave = async () => {
    const allData = collectAll();
    setEmployeesECP(allData);
    console.log(allData);
    try {
      const response = await updateOrCreateECP(allData);
      console.log("Data saved successfully!");
      return response; // return the response
    } catch (error) {
      console.error("Error saving data:", error);
      throw error; // throw the error so it can be caught by the catch block in LoadingButton
    }
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

  return (
    <>
      <div className='controls'>
        <h4>Lista ECP</h4>
        <LoadingButton
          action={gatherDataAndSave}
          buttonText='Zapisz'></LoadingButton>
      </div>
      <ECPList
        subordinates={props.subordinates}
        dzial={dzial}
        setEmployeesECP={setEmployeesECP}
        reasons={reasons}
        date={date}
      />
    </>
  );
};

export default ECP;
