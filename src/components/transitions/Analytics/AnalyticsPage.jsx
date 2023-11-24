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
  const [allDepartments, setAllDepartments] = useState([
    ...new Set(subordinates.map((e) => e.Dzial)),
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState([
    allDepartments[0],
  ]);
  console.log(selectedDepartments);
  const [allPositions, setAllPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState();
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
      setAllDepartments(newDepartments);
      setSelectedDepartments(newDepartments[0]);
    }
  }, [employees, user]);

  useEffect(() => {
    if (selectedDepartments === "Każdy") {
      setSelectedPositions(null);
      return;
    }
    const dep = employees.find(
      (employee) => employee.Dzial === selectedDepartments
    );
    if (dep) {
      fetchData(positionApi, dep.DzialID).then((fetchedPositions) => {
        setAllPositions(fetchedPositions);
        if (fetchedPositions.length > 0) {
          setSelectedPositions(fetchedPositions[0]);
        }
      });
    } else {
      console.log("Nie znaleziono działu o nazwie:", selectedDepartments);
      fetchData(positionApi, 1).then((fetchedPositions) => {
        setAllPositions(fetchedPositions);
        if (fetchedPositions.length > 0) {
          setSelectedPositions(fetchedPositions[0]);
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
    <div className='analytics w-100 d-flex flex-direction-row'>
      <div className=''></div>
      <div></div>
    </div>
  );
};

export default AnalyticsPage;
