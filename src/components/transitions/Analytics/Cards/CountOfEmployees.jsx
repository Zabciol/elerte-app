import React, { useEffect, useState } from "react";
import { generateHighContrastColor } from "../../../common/CommonFunctions";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import {
  countOfEmployeesOnPositionApi,
  countOfEmployeesOnDepartmentApi,
} from "../../../../api/analiticsApi";

const CountOfEmployees = ({
  selectedDates,
  selectedDepartments,
  selectedPositions,
  options,
}) => {
  const [datasets, setDatasets] = useState([]);

  const fetchData = async () => {
    if (Array.isArray(selectedPositions) && selectedPositions.length > 0) {
      let data = [];
      for (const position of selectedPositions) {
        const dates = selectedDates.map((date) => date.value);
        console.log(position);
        const response = await countOfEmployeesOnPositionApi(
          position.ID,
          dates
        );
        console.log("Response: ", response);
        data.push({
          label: position.Nazwa,
          data: response.map((item) => item.Count),
        });
      }
      console.log("nowe dane: ", data);
      setDatasets(data);

      //pobieram dane na pozycje i tak je ustawiam
    } else {
      let data = [];
      for (const department of selectedDepartments) {
        const dates = selectedDates.map((date) => date.value);
        console.log(department);
        const response = await countOfEmployeesOnDepartmentApi(
          department.ID,
          dates
        );
        console.log("Response: ", response);
        data.push({
          label: department.nazwa,
          data: response.map((item) => item.Count),
        });
      }
      console.log("nowe dane: ", data);
      setDatasets(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDates, selectedDepartments, selectedPositions]);

  useEffect(() => {
    const updatedDatasets = datasets.map((dataset, index) => {
      const newColor = generateHighContrastColor(dataset.label + index); // Dodanie indexu do labela, aby zapewnić unikalność
      return {
        ...dataset,
        borderColor: newColor,
        backgroundColor: `${newColor.slice(0, -1)}, 0.5)`,
      };
    });

    setDatasets(updatedDatasets);
  }, [datasets.length]);

  const data = {
    labels: selectedDates.map((date) => date.value),
    datasets: datasets,
  };

  return (
    <div className='chart-container'>
      <h2>Liczba Pracowników</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default CountOfEmployees;
