import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const CountOfEmployees = ({
  selectedDates,
  selectedDepartments,
  selectedPositions,
}) => {
  console.log("Daty: ", selectedDates);
  console.log("Działy: ", selectedDepartments);
  console.log("Stanowiska: ", selectedPositions);
  const data = {
    labels: selectedDates.map((date) => date.value),
    datasets: [
      {
        label: "Liczba Pracowników",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Liczba Pracowników",
        data: [15, 29, 30, 51, 26, 45],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div>
      <h2>Liczba Pracowników</h2>
      <Line data={data} />
    </div>
  );
};

export default CountOfEmployees;
