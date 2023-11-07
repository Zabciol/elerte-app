import React, { useEffect, useState } from "react";
import { getAcceptedRequestsApi } from "../../../api/requestsApi";
import { getAbsenceAPI } from "../../../api/ecpApi";

const EmployeesAbsence = ({ date, subordinates }) => {
  const [absence, setAbsence] = useState([]);

  const uniteTabs = (tablicaNieobecnosci, tablicaUrlopy) => {
    const pracownicy = new Map();
    const dodajDoPracownika = (id, dane, typ) => {
      const pracownik = pracownicy.get(id) || {
        ID: id,
        Urlopy: [],
        Nieobecnosci: [],
      };

      if (typ === "Urlop") {
        pracownik.Urlopy.push(dane);
      } else if (typ === "Nieobecnosc") {
        pracownik.Nieobecnosci.push(dane);
      }

      pracownicy.set(id, pracownik);
    };

    tablicaNieobecnosci.forEach((nieobecnosc) => {
      dodajDoPracownika(
        nieobecnosc.ID,
        {
          Data: nieobecnosc.Data,
          Od_godz: nieobecnosc.Od_godz,
          Do_godz: nieobecnosc.Do_godz,
          IloscGodzin: nieobecnosc.IloscGodzin,
          Powod: nieobecnosc.Powod,
        },
        "Nieobecnosc"
      );
    });

    tablicaUrlopy.forEach((urlop) => {
      dodajDoPracownika(
        urlop.ID,
        {
          Data_Od: urlop.Data_Od,
          Data_Do: urlop.Data_Do,
          Powod: urlop.Powod,
        },
        "Urlop"
      );
    });

    return Array.from(pracownicy.values()).map((pracownik) => ({
      ID: pracownik.ID,
      Imie:
        tablicaNieobecnosci.find((n) => n.ID === pracownik.ID)?.Imie ||
        tablicaUrlopy.find((u) => u.ID === pracownik.ID)?.Imie,
      Nazwisko:
        tablicaNieobecnosci.find((n) => n.ID === pracownik.ID)?.Nazwisko ||
        tablicaUrlopy.find((u) => u.ID === pracownik.ID)?.Nazwisko,
      Urlopy: pracownik.Urlopy,
      Nieobecnosci: pracownik.Nieobecnosci,
    }));
  };

  const getUrlopy = async (IDs) => {
    const data = await getAcceptedRequestsApi(date, IDs);
    console.log(data.message);
    return data.data;
  };

  const getAbsence = async (IDs) => {
    const data = await getAbsenceAPI(date, IDs);
    console.log(data.message);
    return data.data;
  };
  const getData = async () => {
    if (subordinates.length) {
      const IDs = subordinates.map((employee) => employee.ID);
      const urlopy = await getUrlopy(IDs);
      const nieobecnosci = await getAbsence(IDs);
      const newAbsence = uniteTabs(nieobecnosci, urlopy);
      console.log(newAbsence);
      setAbsence(newAbsence);
    }
  };

  useEffect(() => {
    getData();
  }, [subordinates]);

  return <div>EmployeesAbsence</div>;
};

export default EmployeesAbsence;
