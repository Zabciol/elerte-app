import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";

const NewEmployee = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const stepsData = [
    {
      fields: [
        { type: "input", label: "Imię", name: "imie" },
        { type: "input", label: "Nazwisko", name: "nazwisko" },
      ],
      buttonLabel: "Następny",
    },
    {
      fields: [
        { type: "input", label: "Email", name: "email", inputType: "email" },
        {
          type: "input",
          label: "Nr telefonu",
          name: "nrTelefonu",
          inputType: "tel",
        },
      ],
      buttonLabel: "Następny",
    },
    {
      fields: [
        {
          type: "select",
          label: "Dział",
          name: "dzial",
          options: departments,
        },
        {
          type: "select",
          label: "Stanowisko",
          name: "stanowisko",
          options: ["Stanowisko1", "Stanowisko2"],
        },
      ],
      buttonLabel: "Zapisz",
    },
  ];

  const currentStepData = stepsData[step - 1];

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const handleSubmit = () => {
    setStep(1);
    console.log(formData);
  };

  const getData = async () => {
    const supervisors = await supervisorsApi();
    console.log(supervisors);
    setSupervisors(supervisors);

    const departments = await departmentsApi();
    console.log(departments);
    setDepartments(departments);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <FormInput
        stepData={currentStepData}
        handleChange={handleChange}
        values={formData}
        handleNext={nextStep}
      />
    </>
  );
};

export default NewEmployee;
