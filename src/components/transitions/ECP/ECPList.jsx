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

  const filteredSubordinates =
    dzial === "Każdy"
      ? subordinates
      : subordinates.filter((employee) => employee.Dzial === dzial);

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
    console.log(allData);
    const newAllData = {
      ecp: allData,
      editDate: getCurrentDateTime(),
      editUser: user.ID,
    };
    console.log(newAllData);
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
            date={date}
          />
        ))}
      </Accordion>
    </>
  );
};

export default ECPList;
