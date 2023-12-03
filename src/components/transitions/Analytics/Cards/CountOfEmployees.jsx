import React, { useEffect, useState } from "react";
import { generateHighContrastColor } from "../../../common/CommonFunctions";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const CountOfEmployees = ({
  selectedDates,
  selectedDepartments,
  selectedPositions,
  options,
}) => {
  console.log("Daty: ", selectedDates);
  console.log("Działy: ", selectedDepartments);
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

  useEffect(() => {
    datasets.forEach((dataset) => {
      const baseColor = generateHighContrastColor(); // Generuje unikalny kolor dla każdego datasetu
      dataset.borderColor = `${baseColor.slice(0, -1)}, 0.2)`; // Dodaje przezroczystość dla obwódki
      dataset.backgroundColor = `${baseColor.slice(0, -1)}, 1)`; // Pełna przezroczystość dla tła
    });
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
