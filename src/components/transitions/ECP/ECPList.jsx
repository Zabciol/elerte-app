import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";
import { reasonsApi } from "../../../api/reasonsApi";
import LoadingButton from "../../common/LoadingBtn";
import { SentECPToDatabase } from "../../../api/ecpApi";
import { useGetData } from "./ECPDataContext";
import { getCurrentDateTime } from "../../common/CommonFunctions";

const ECPList = ({ user, subordinates, dzial, date }) => {
  const [reasons, setReasons] = useState([]);
  const { collectAll } = useGetData();
  const activeSubordinates = subordinates.filter(
    (employee) => employee.Aktywny === "Tak"
  );
  const filteredSubordinates =
    dzial === "Każdy"
      ? activeSubordinates
      : activeSubordinates.filter((employee) => employee.Dzial === dzial);

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

  const gatherDataAndSave = async () => {
    const allData = collectAll();
    const newAllData = {
      ecpList: allData,
      date: date,
      editDate: getCurrentDateTime(),
      editUser: user.ID,
    };
    console.log(newAllData);
    try {
      const response = await SentECPToDatabase(newAllData);
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
            employee={employee}
            reasons={reasons}
            date={date}
            key={employee.ID}
          />
        ))}
      </Accordion>
    </>
  );
};

export default ECPList;
