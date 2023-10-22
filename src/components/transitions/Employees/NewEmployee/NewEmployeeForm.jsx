import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";
import { positionApi } from "../../../../api/positionApi";
import { workingTimeApi } from "../../../../api/workingTimeApi";
import PopUp from "../../../common/PopUp";

const NewEmployeeForm = (props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    nrTelefonu: "",
  });

  const [supervisors, setSupervisors] = useState();
  const [departments, setDepartments] = useState();
  const [positions, setPositions] = useState();
  const [workingTime, setWorkingTime] = useState();
  const [showPopUp, setShowPopUp] = useState(false);

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
          value: formData.dzial,
        },
        {
          type: "select",
          label: "Stanowisko",
          name: "stanowisko",
          options: positions,
          value: formData.stanowisko,
        },
        {
          type: "select",
          label: "Wymiar pracy",
          name: "wymiarPracy",
          options: workingTime,
          value: formData.wymiarPracy,
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
    const hasEmptyValue = Object.values(formData).some(
      (value) => value === "" || value === null || value === undefined
    );
    if (hasEmptyValue) {
      setShowPopUp(true);
      setStep(1);
    } else {
      console.log(formData);
      props.setNewEmployee(formData);
      props.setShowPopUp(true);
    }
  };

  const getWorkingTime = async () => {
    const data = await workingTimeApi();
    console.log(data);

    const transformedData = data.map((item) => ({
      ID: item.ID,
      Nazwa: item.Od + " - " + item.Do,
    }));
    setFormData((prevData) => ({
      ...prevData,
      wymiarPracy: data[0].ID,
    }));

    console.log(transformedData);
    setWorkingTime(transformedData);
  };

  const getFromApi = async (name, apiFuncion, setState, value) => {
    let data;
    if (value === undefined) data = await apiFuncion();
    else data = await apiFuncion(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: data[0].ID,
    }));

    setState(data);
  };

  const getData = () => {
    //getFromApi(supervisorsApi, setSupervisors);
    getFromApi("dzial", departmentsApi, setDepartments);
    getFromApi("stanowisko", positionApi, setPositions, 1);
    getWorkingTime();
  };

  useEffect(() => {
    if (formData.dzial)
      getFromApi("stanowisko", positionApi, setPositions, formData.dzial);
  }, [formData.dzial]);

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
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        title={"Powiadomienie"}
        message={"Wprowadź odpowiednie dane"}
      />
    </>
  );
};

export default NewEmployeeForm;
