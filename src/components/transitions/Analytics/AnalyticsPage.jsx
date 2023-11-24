import React, { useState, useCallback, useEffect } from "react";
import { SelectDzial } from "../../layout/Menu/MenuForms";
import Form from "react-bootstrap/Form";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";
import { positionApi } from "../../../api/positionApi";
import { allEmployeesAPI } from "../../../api/employeesApi";

const MenuItems = React.memo(({ dzial, dzialy, setDzial, date, setDate }) => {
  return (
    <>
      <SelectDzial dzial={dzial} dzialy={dzialy} setDzial={setDzial} />
      <Form.Control
        type='month'
        value={date}
        onChange={setDate}
        className='menu-select'
      />
    </>
  );
});

const hasAdminPermissions = (user) =>
  user.Uprawnienia === 3 || user.Uprawnienia === 4;

const hasAdminView = (user) => user.Uprawnienia === 2 || user.Uprawnienia === 4;

const AnalyticsPage = ({ user, subordinates, setMenuItems }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [employees, setEmployees] = useState(subordinates);
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [departments, setDepartments] = useState([
    ...new Set(subordinates.map((e) => e.Dzial)),
  ]);
  const [department, setDepartment] = useState(departments[0]);
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState();

  const changeDate = useCallback(
    (event) => {
      setDate(event.target.value);
    },
    [setDate]
  );
  const fetchData = async (api, args) => {
    try {
      return await api(args);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setShowPopUpLogout(true);
      return [];
    }
  };

  const getEmployees = useCallback(async () => {
    try {
      if (hasAdminView(user) || hasAdminPermissions(user))
        setEmployees(await allEmployeesAPI());
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  }, [user, subordinates]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    if (employees.length > 0) {
      const newDepartments = Array.from(
        new Set(
          hasAdminView(user) || hasAdminPermissions
            ? employees.map((e) => e.Dzial)
            : subordinates.map((e) => e.Dzial)
        )
      );
      setDepartments(newDepartments);
      setDepartment(newDepartments[0]);
    }
  }, [employees, user]);

  useEffect(() => {
    fetchData(positionApi, department || 1).then(setPositions);
    console.log(positions);
  }, [department]);

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={department}
        dzialy={departments}
        setDzial={setDepartment}
        date={date}
        setDate={changeDate}
      />
    );
  }, [department, date, departments]);

  return <div>AnalyticsPage</div>;
};

export default AnalyticsPage;
