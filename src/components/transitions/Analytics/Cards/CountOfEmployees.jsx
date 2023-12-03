import React, { useEffect, useState } from "react";
import { generateHighContrastColor } from "../../../common/CommonFunctions";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

import { countOfEmployeesOnPositionApi } from "../../../../api/analiticsApi";

const CountOfEmployees = ({
  selectedDates,
  selectedDepartments,
  selectedPositions,
  options,
}) => {
  console.log("Daty: ", selectedDates);
  //console.log("Działy: ", selectedDepartments);
  console.log("Stanowiska: ", selectedPositions);

  const [datasets, setDatasets] = useState([
    {
      label: "Liczba Pracowników 1",
      data: [65, 59, 86, 71, 56, 55],
      fill: false,
    },
    {
      label: "Liczba Pracowników 2",
      data: [15, 29, 30, 51, 26, 45],
      fill: false,
    },
  ]);

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
      setDatasets([
        {
          label: "Liczba Pracowników 1",
          data: [65, 59, 86, 71, 56, 55],
          fill: false,
        },
        {
          label: "Liczba Pracowników 2",
          data: [15, 29, 30, 51, 26, 45],
          fill: false,
        },
      ]);
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
