import React, { useState, useCallback, useEffect } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";
import Form from "react-bootstrap/Form";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";
import { positionApi } from "../../../api/positionApi";
import { allEmployeesAPI } from "../../../api/employeesApi";

const MenuItems = React.memo(
  ({ dzial, dzialy, setDzial, position, positions, setPosition }) => {
    return (
      <>
        {position ? (
          <SelectItems
            item={position}
            items={positions}
            setItem={setPosition}
          />
        ) : null}
        <SelectItems item={dzial} items={dzialy} setItem={setDzial} />
      </>
    );
  }
);

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
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

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
    if (department === "Każdy") {
      setPosition(null);
      return;
    }
    const dep = employees.find((employee) => employee.Dzial === department);
    if (dep) {
      fetchData(positionApi, dep.DzialID).then((fetchedPositions) => {
        setPositions(fetchedPositions);
        if (fetchedPositions.length > 0) {
          setPosition(fetchedPositions[0]);
        }
      });
    } else {
      console.log("Nie znaleziono działu o nazwie:", department);
      fetchData(positionApi, 1).then((fetchedPositions) => {
        setPositions(fetchedPositions);
        if (fetchedPositions.length > 0) {
          setPosition(fetchedPositions[0]);
        }
      });
    }
  }, [department, employees]);

  useEffect(() => {
    //console.log(employees);
    console.log(department);
    console.log(position);
    console.log(positions);
    if (position) {
      let filtered;
      if (position.Nazwa === "Każdy") {
        filtered = employees.filter(
          (employee) => employee.Dzial === department
        );
      } else {
        filtered = employees.filter(
          (employee) => employee.StanowiskoID === position.ID
        );
      }
      console.log(filtered);
    }
  }, [position]);

  useEffect(() => {
    setMenuItems(
      <MenuItems
        dzial={department}
        dzialy={departments}
        setDzial={setDepartment}
        date={date}
        setDate={changeDate}
        position={position}
        positions={positions}
        setPosition={setPosition}
      />
    );
  }, [department, date, departments, position, positions]);

  return <div>AnalyticsPage</div>;
};

export default AnalyticsPage;
