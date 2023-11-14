import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { supervisorsApi } from "../../../../api/employeesApi";
import { departmentsApi } from "../../../../api/departmentsApi";
import { positionApi } from "../../../../api/positionApi";
import { workingTimeApi } from "../../../../api/workingTimeApi";
import PopUp from "../../../common/PopUp";
import { useAuth } from "../../Login/AuthContext";

const NewEmployeeForm = (props) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    telephoneNumber: "",
  });

  const [supervisors, setSupervisors] = useState();
  const [departments, setDepartments] = useState();
  const [positions, setPositions] = useState();
  const [workingTime, setWorkingTime] = useState();
  const [showPopUp, setShowPopUp] = useState(false);

  const stepsData = [
    {
      fields: [
        { type: "input", label: "Imię", name: "name" },
        { type: "input", label: "Nazwisko", name: "lastname" },
      ],
      buttonLabel: "Następny",
    },
    {
      fields: [
        { type: "input", label: "Email", name: "email", inputType: "email" },
        {
          type: "input",
          label: "Nr telefonu",
          name: "telephoneNumber",
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
          name: "department",
          options: departments,
          value: formData.department,
        },
        {
          type: "select",
          label: "Stanowisko",
          name: "position",
          options: positions,
          value: formData.position,
        },
        {
          type: "select",
          label: "Wymiar pracy",
          name: "workingTime",
          options: workingTime,
          value: formData.workingTime,
        },
        {
          type: "select",
          label: "Przelozony",
          name: "supervisor",
          options: supervisors,
          value: formData.supervisor,
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
    const { email, ...restFormData } = formData;
    const hasEmptyValue = Object.values(restFormData).some(
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
    try {
      const data = await workingTimeApi();
      const transformedData = data.map((item) => ({
        ID: item.ID,
        Nazwa: item.Od + " - " + item.Do,
      }));
      setFormData((prevData) => ({
        ...prevData,
        workingTime: data[0].ID,
      }));

      setWorkingTime(transformedData);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getSuperVisors = async () => {
    try {
      const data = await supervisorsApi();
      const transformedData = data.map((item) => ({
        ID: item.ID,
        Nazwa: item.Imie + " " + item.Nazwisko + " - " + item.Nazwa,
      }));
      setFormData((prevData) => ({
        ...prevData,
        supervisor: data[0].ID,
      }));

      setSupervisors(transformedData);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getFromApi = async (name, apiFuncion, setState, value) => {
    try {
      let data;
      if (value === undefined) data = await apiFuncion();
      else data = await apiFuncion(value);

      setFormData((prevData) => ({
        ...prevData,
        [name]: data[0].ID,
      }));
      setState(data);
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getData = () => {
    getSuperVisors();
    getFromApi("department", departmentsApi, setDepartments);
    getFromApi("position", positionApi, setPositions, 1);
    getWorkingTime();
  };

  useEffect(() => {
    if (formData.department)
      getFromApi("position", positionApi, setPositions, formData.department);
  }, [formData.department]);

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
