import React, { useState, useCallback, useEffect } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";
import Form from "react-bootstrap/Form";
import { getCurrentDateYearMonth } from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";
import { positionApi } from "../../../api/positionApi";
import { allEmployeesAPI } from "../../../api/employeesApi";
import Select from "react-select";
import "../../../styles/Analytics.css";
import MenuItemsAnalitycs from "./MenuItemsAnalitycs";

const hasAdminPermissions = (user) =>
  user.Uprawnienia === 3 || user.Uprawnienia === 4;

const hasAdminView = (user) => user.Uprawnienia === 2 || user.Uprawnienia === 4;

const AnalyticsPage = ({ user, subordinates, setMenuItems }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [employees, setEmployees] = useState(subordinates);
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  console.log(selectedDepartments);
  const [allPositions, setAllPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState();
  //const [filteredEmployees, setFilteredEmployees] = useState(employees);

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
      setAllDepartments(newDepartments);
      setSelectedDepartments(newDepartments[0]);
    }
  }, [employees, user]);
  useEffect(() => {
    const deps = employees.filter((employee) =>
      selectedDepartments.includes(employee.Dzial)
    );
    const uniqueDepartmentIds = [...new Set(deps.map((emp) => emp.DzialID))];
    if (uniqueDepartmentIds.length > 0) {
      Promise.all(
        uniqueDepartmentIds.map((deptId) => fetchData(positionApi, deptId))
      ).then((responses) => {
        const allPositions = responses.flat();
        setAllPositions(allPositions);
        if (allPositions.length > 0) {
          setSelectedPositions([allPositions[0]]);
        }
      });
    } else {
      console.log("Nie znaleziono działów o nazwach:", selectedDepartments);
      fetchData(positionApi, 1).then((fetchedPositions) => {
        setAllPositions(fetchedPositions);
        if (fetchedPositions.length > 0) {
          setSelectedPositions([fetchedPositions[0]]);
        }
      });
    }
  }, [selectedDepartments, employees]);

  useEffect(() => {
    //console.log(employees);
    console.log(selectedDepartments);
    console.log(selectedPositions);
    console.log(allPositions);
    if (selectedPositions) {
      let filtered;
      if (selectedPositions.Nazwa === "Każdy") {
        filtered = employees.filter(
          (employee) => employee.Dzial === selectedDepartments
        );
      } else {
        filtered = employees.filter(
          (employee) => employee.StanowiskoID === selectedPositions.ID
        );
      }
      console.log(filtered);
    }
  }, [selectedPositions]);

  useEffect(() => {
    setAllDepartments([...new Set(employees.map((e) => e.Dzial))]);
  }, [employees]);

  useEffect(() => {
    if (allDepartments.length > 0) {
      setSelectedDepartments([allDepartments[0]]);
    }
  }, [allDepartments]);

  const handleMultiSelectChange = (
    selectedOptions,
    setState,
    mapOptionToState
  ) => {
    setState(selectedOptions.map(mapOptionToState));
  };

  useEffect(() => {
    setMenuItems(
      <MenuItemsAnalitycs
        dzial={selectedDepartments}
        dzialy={allDepartments}
        setDzial={setSelectedDepartments}
        date={date}
        setDate={changeDate}
        position={selectedPositions}
        positions={allPositions}
        setPosition={setSelectedPositions}
        handleChange={handleMultiSelectChange}
      />
    );
  }, [
    selectedDepartments,
    date,
    allDepartments,
    selectedPositions,
    allPositions,
  ]);

  return (
    <div className='analytics w-100 '>
      <div className=''></div>
      <div></div>
    </div>
  );
};

export default AnalyticsPage;
