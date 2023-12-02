import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  getCurrentDateYearMonth,
  generateMonthsArray,
  getCurrentMonthYearInObject,
} from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";
import { positionApi } from "../../../api/positionApi";
import "../../../styles/Analytics.css";
import { isAdmin, hasView } from "../../common/CommonFunctions";
import MenuItemsAnalitycs from "./MenuItemsAnalitycs";
import Carousel from "react-bootstrap/Carousel";
import ElerteFooter from "../../../assets/Carousel/elerte-bottom.png";

const AnalyticsPage = ({ user, subordinates, setMenuItems }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [date, setDate] = useState(getCurrentDateYearMonth());
  const [departments, setDepartments] = useState(
    Array.from(new Set(subordinates.map((e) => e.Dzial)))
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
    if (subordinates.length > 0) {
      const newDepartments = Array.from(
        new Set(
          hasView(user) || isAdmin(user)
            ? subordinates.map((e) => e.Dzial)
            : subordinates.map((e) => e.Dzial)
        )
      );
      setDepartments(newDepartments);
      setSelectedDepartments(newDepartments[0]);
    }
  }, [subordinates, user]);

  useEffect(() => {
    if (subordinates.length > 0) {
      const deps = subordinates.filter((employee) =>
        selectedDepartments.includes(employee.Dzial)
      );
      const uniqueDepartmentIds = [...new Set(deps.map((emp) => emp.Dzial_ID))];
      if (uniqueDepartmentIds.length > 0 && uniqueDepartmentIds[0]) {
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
        fetchData(positionApi, user.Dzial_ID).then((fetchedPositions) => {
          setAllPositions(fetchedPositions);
          if (fetchedPositions.length > 0) {
            setSelectedPositions([fetchedPositions[0]]);
          }
        });
      }
    }
  }, [selectedDepartments, subordinates, user, fetchData]);

  useEffect(() => {
    if (selectedPositions) {
      let filtered;
      if (selectedPositions.Nazwa === "Każdy") {
        filtered = subordinates.filter(
          (employee) => employee.Dzial === selectedDepartments
        );
      } else {
        filtered = subordinates.filter(
          (employee) => employee.StanowiskoID === selectedPositions.ID
        );
      }
    }
  }, [selectedPositions, subordinates, selectedDepartments]);

  useEffect(() => {
    if (departments.length > 0) {
      setSelectedDepartments([departments[0]]);
    }
  }, [departments]);

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [selectedDepartments, selectedMonths, selectedPositions]);

  useEffect(() => {
    console.log(selectedMonths);
  }, [selectedMonths]);

  const handleMultiSelectChange = useCallback(
    (selectedOptions, setState, mapOptionToState) => {
      setState(selectedOptions.map(mapOptionToState));
    },
    []
  );

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
