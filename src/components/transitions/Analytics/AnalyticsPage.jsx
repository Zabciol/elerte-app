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
  const allMonths = generateMonthsArray(2, 0);
  const [selectedMonths, setSelectedMonths] = useState([
    getCurrentMonthYearInObject(),
  ]);
  const [departments, setDepartments] = useState(() => {
    const uniqueDepartments = new Map(
      subordinates.map((e) => [e.Dzial_ID, { ID: e.Dzial_ID, nazwa: e.Dzial }])
    );
    return Array.from(uniqueDepartments.values());
  });

  const [selectedDepartments, setSelectedDepartments] = useState([
    departments[0],
  ]);
  const [allPositions, setAllPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState();
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
    const fetchPositions = async () => {
      const newPositions = [];

      for (const department of selectedDepartments) {
        try {
          const data = await fetchData(positionApi, department.ID);
          newPositions.push(...data);
        } catch (error) {
          console.error("Error fetching positions:", error);
        }
      }
      console.log(newPositions);
      setAllPositions(newPositions);
    };

    if (selectedDepartments.length > 0) {
      fetchPositions();
    }
  }, [selectedDepartments, fetchData]);

  useEffect(() => {
    setMenuItems(memoizedMenuItems);
  }, [selectedDepartments, selectedMonths, selectedPositions, allPositions]);

  const handleMultiSelectChange = useCallback(
    (selectedOptions, setState, mapOptionToState) => {
      setState(selectedOptions.map(mapOptionToState));
    },
    []
  );

  const memoizedMenuItems = useMemo(
    () => (
      <MenuItemsAnalitycs
        selectedDepartments={selectedDepartments}
        departments={departments}
        setSelectedDepartments={setSelectedDepartments}
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
