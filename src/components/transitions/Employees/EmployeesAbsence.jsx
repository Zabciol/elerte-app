import React, { useEffect, useState } from "react";
import { getAcceptedRequestsApi } from "../../../api/requestsApi";
import { getAbsenceAPI } from "../../../api/ecpApi";

const EmployeesAbsence = ({ date, subordinates }) => {
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [absence, setAbsence] = useState([]);

  const getUrlopy = async (IDs) => {
    const data = await getAcceptedRequestsApi(date, IDs);
    console.log(data.message);
    const urlopy = data.data;
    const urlopyPoID = urlopy.reduce((acc, urlop) => {
      const { ID, Imie, Nazwisko, Dzial, Stanowisko, ...szczegolyUrlopu } =
        urlop;
      const znalezionyIndex = acc.findIndex((el) => el.id === ID);
      if (znalezionyIndex === -1) {
        acc.push({
          ID: ID,
          Imie: Imie,
          Nazwisko: Nazwisko,
          Dzial: Dzial,
          Stanowisko: Stanowisko,
          Urlopy: [szczegolyUrlopu],
        });
      } else {
        acc[znalezionyIndex].urlopy.push(szczegolyUrlopu);
      }
      return acc;
    }, []);
    console.log(urlopyPoID);
    setAcceptedRequest(urlopyPoID);
  };

  const getAbsence = async (IDs) => {
    const data = await getAbsenceAPI(date, IDs);
    console.log(data);
  };
  const getData = async () => {
    if (subordinates.length) {
      const IDs = subordinates.map((employee) => employee.ID);
      await getUrlopy(IDs);
      await getAbsence(IDs);
    }
  };

  useEffect(() => {
    getData();
  }, [subordinates]);

  return <div>EmployeesAbsence</div>;
};

export default EmployeesAbsence;
