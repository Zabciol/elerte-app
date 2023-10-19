import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";
import { reasonsApi } from "../../../api/reasonsApi";
import LoadingButton from "../../common/LoadingBtn";
import { SentECPToDatabase } from "../../../api/ecpApi";
import { GetDataProvider, useGetData } from "./ECPDataContext";

const ECPList = (props) => {
  const [employeesECP, setEmployeesECP] = useState([]);
  const [reasons, setReasons] = useState([]);
  const filteredSubordinates =
    props.dzial === "Każdy"
      ? props.subordinates
      : props.subordinates.filter((employee) => employee.Dzial === props.dzial);

  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      setReasons(data.data);
    } catch (error) {
      console.log(
        error.message || "Nie udało się uzyskać powodów nieobecności"
      );
    }
  };
  useEffect(() => {
    getReasons();
  }, []);

  const { collectors, collectAll } = useGetData();

  const gatherDataAndSave = async () => {
    const allData = collectAll();
    setEmployeesECP(allData);
    console.log(allData);
    try {
      const response = await SentECPToDatabase(allData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <div className='controls'>
        <h4>Lista ECP</h4>
        <LoadingButton
          action={gatherDataAndSave}
          buttonText='Zapisz'></LoadingButton>
      </div>
      <Accordion className='ECP'>
        {filteredSubordinates.map((employee) => (
          <ECPListItem
            key={employee.ID}
            employee={employee}
            reasons={reasons}
            date={props.date}
          />
        ))}
      </Accordion>
    </>
  );
};

export default ECPList;
