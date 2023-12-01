import React, { useState, useCallback, useEffect, useMemo } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";
import Form from "react-bootstrap/Form";
import {
  getCurrentDateYearMonth,
  generateMonthsArray,
  getCurrentMonthYearInObject,
} from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";
import { positionApi } from "../../../api/positionApi";
import { allEmployeesAPI } from "../../../api/employeesApi";
import Select from "react-select";
import "../../../styles/Analytics.css";
import MenuItemsAnalitycs from "./MenuItemsAnalitycs";
import Carousel from "react-bootstrap/Carousel";
import ElerteFooter from "../../../assets/Carousel/elerte-bottom.png";

const hasAdminPermissions = (user) =>
  user.Uprawnienia === 3 || user.Uprawnienia === 4;

const hasAdminView = (user) => user.Uprawnienia === 2 || user.Uprawnienia === 4;

const AnalyticsPage = ({ user, subordinates, setMenuItems }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [employees, setEmployees] = useState(subordinates);
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [departments, setDepartments] = useState(
    Array.from(new Set(employees.map((e) => e.Dzial)))
  );
  const [selectedDepartments, setSelectedDepartments] = useState([
    departments[0],
  ]);
  const [allPositions, setAllPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState();
  const allMonths = generateMonthsArray(2, 0);
  const [selectedMonths, setSelectedMonths] = useState([
    getCurrentMonthYearInObject(),
  ]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log(allMonths);
    console.log(selectedMonths);

    const importAllImages = (r) => {
      return r.keys().map(r);
    };
    const imageContext = require.context(
      "../../../assets/Carousel",
      false,
      /\.(png|jpe?g|svg)$/
    );
    const importedImages = importAllImages(imageContext);
    setImages(importedImages);
  }, []);

  const changeDate = useCallback((event) => {
    setDate(event.target.value);
  }, []);

  const fetchData = useCallback(
    async (api, args) => {
      try {
        return await api(args);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
        setShowPopUpLogout(true);
        return [];
      }
    },
    [setMessage, setShowPopUpLogout]
  );

  useEffect(() => {
    const getEmployees = async () => {
      try {
        if (hasAdminView(user)) setEmployees(await allEmployeesAPI());
      } catch (error) {
        setMessage(error.message);
        setShowPopUpLogout(true);
      }
    };
    getEmployees();
  }, [user]);

  useEffect(() => {
    const newDepartments = Array.from(
      new Set(
        hasAdminView(user) || hasAdminPermissions
          ? employees.map((e) => e.Dzial)
          : subordinates.map((e) => e.Dzial)
      )
    );
    console.log(newDepartments);
    setDepartments(newDepartments);
    setSelectedDepartments(newDepartments[0]);
  }, [employees, user, subordinates]);

  useEffect(() => {
    const deps = employees.filter((employee) =>
      selectedDepartments.includes(employee.Dzial)
    );
    const uniqueDepartmentIds = [...new Set(deps.map((emp) => emp.Dzial_ID))];

    Promise.all(
      uniqueDepartmentIds.map((deptId) => fetchData(positionApi, deptId))
    ).then((responses) => {
      const allPositions = responses.flat();
      setAllPositions(allPositions);
      if (allPositions.length > 0) {
        setSelectedPositions([allPositions[0]]);
      }
    });
  }, [selectedDepartments, employees, fetchData, subordinates]);

  useEffect(() => {
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
    }
  }, [selectedPositions, employees, selectedDepartments]);

  useEffect(() => {
    setDepartments([...new Set(employees.map((e) => e.Dzial))]);
  }, [employees]);

  useEffect(() => {
    if (departments.length > 0) {
      setSelectedDepartments([departments[0]]);
    }
  }, [departments]);

  const handleMultiSelectChange = useCallback(
    (selectedOptions, setState, mapOptionToState) => {
      setState(selectedOptions.map(mapOptionToState));
    },
    []
  );

  useEffect(() => {
    console.log(selectedMonths);
  }, [selectedMonths]);

  const memoizedMenuItems = useMemo(
    () => (
      <MenuItemsAnalitycs
        dzial={selectedDepartments}
        dzialy={departments}
        setDzial={setSelectedDepartments}
        date={date}
        setDate={changeDate}
        position={selectedPositions}
        positions={allPositions}
        setPosition={setSelectedPositions}
        selectedMonths={selectedMonths}
        allMonths={allMonths}
        setSelectedMonths={setSelectedMonths}
        handleChange={handleMultiSelectChange}
      />
    ),
    [
      selectedDepartments,
      date,
      departments,
      selectedPositions,
      allPositions,
      changeDate,
      handleMultiSelectChange,
      selectedMonths,
      allMonths,
    ]
  );

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [selectedDepartments, selectedMonths, selectedPositions]);

  return (
    <div className='analytics w-100 '>
      <Carousel>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[0]}
            alt='First slide'
          />
          <Carousel.Caption>
            <h3>Liczba pracowników</h3>
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[5]}
            alt='Second slide'
          />
          <Carousel.Caption>
            <h3>Ilość roboczogodzin</h3>
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className='d-block w-100 h-100 background'
            src={images[3]}
            alt='Third slide'
          />
          <Carousel.Caption>
            <h3>Ilość nadgodzin</h3>
          </Carousel.Caption>
          <img src={ElerteFooter} className='background-footer' />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default AnalyticsPage;
