import React, { useEffect, useState, useMemo } from "react";
import Accordion from "react-bootstrap/Accordion";
import ECPListItem from "./ECPListItem";
import { reasonsApi } from "../../../api/reasonsApi";
import LoadingButton from "../../common/LoadingBtn";
import { SentECPToDatabase } from "../../../api/ecpApi";
import { useGetData } from "./ECPDataContext";
import { getCurrentDateTime } from "../../common/CommonFunctions";
import { useAuth } from "../Login/AuthContext";

const ECPList = ({ user, subordinates, dzial, date, searchValue }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [reasons, setReasons] = useState([]);
  const { collectAll } = useGetData();

  const getUniqueSubordinates = (subordinates) => {
    const uniqueIds = new Set();
    const uniqueSubordinates = [];

    subordinates.forEach((employee) => {
      if (!uniqueIds.has(employee.ID)) {
        uniqueIds.add(employee.ID);
        uniqueSubordinates.push(employee);
      }
    });

    return uniqueSubordinates;
  };

  const activeSubordinates = useMemo(() => {
    return subordinates.filter((employee) => employee.Aktywny === "Tak");
  }, [subordinates]);

  const filteredSubordinates = useMemo(() => {
    return dzial === "Każdy"
      ? getUniqueSubordinates(activeSubordinates)
      : getUniqueSubordinates(
          activeSubordinates.filter((e) => e.Dzial === dzial)
        );
  }, [dzial, activeSubordinates, searchValue]);

  const getReasons = async () => {
    try {
      const data = await reasonsApi();
      setReasons(data.data);
    } catch (error) {
      console.log(
        error.message || "Nie udało się uzyskać powodów nieobecności"
      );
      setShowPopUpLogout(true);
      setMessage(error.message);
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
      setShowPopUpLogout(true);
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
