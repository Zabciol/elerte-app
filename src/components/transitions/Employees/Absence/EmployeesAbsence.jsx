import React, { useEffect, useState } from "react";
import { getAcceptedRequestsApi } from "../../../../api/requestsApi";
import { getAbsenceAPI } from "../../../../api/ecpApi";
import EmployeesList from "../EmployeesList";
import EmployeeAbsenceInf from "./EmployeeAbsenceInf";
import "../../../../styles/absence.css";
import { useAuth } from "../../Login/AuthContext";
const EmployeesAbsence = ({ date, subordinates, user, dzial }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
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
          ImieAkceptujacego: urlop.ImieAkceptujacego,
          NazwiskoAkceptujacego: urlop.NazwiskoAkceptujacego,
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
      Stanowisko:
        tablicaNieobecnosci.find((n) => n.ID === pracownik.ID)?.Stanowisko ||
        tablicaUrlopy.find((u) => u.ID === pracownik.ID)?.Stanowisko,
      Urlopy: pracownik.Urlopy,
      Nieobecnosci: pracownik.Nieobecnosci,
    }));
  };

  const getUrlopy = async (IDs) => {
    try {
      const data = await getAcceptedRequestsApi(date, IDs);
      console.log(data.message);
      return data.data;
    } catch (error) {
      setShowPopUpLogout(true);
      setMessage(error.message);
    }
  };

  const getAbsence = async (IDs) => {
    try {
      const data = await getAbsenceAPI(date, IDs);
      console.log(data.message);
      return data.data;
    } catch (error) {
      setShowPopUpLogout(true);
      setMessage(error.message);
    }
  };
  const getData = async () => {
    if (subordinates.length) {
      const IDs = subordinates.map((employee) => employee.ID);
      const urlopy = await getUrlopy(IDs);
      const nieobecnosci = await getAbsence(IDs);
      const newAbsence = uniteTabs(nieobecnosci, urlopy);
      setAbsence(newAbsence);
    }
  };

  useEffect(() => {
    getData();
  }, [subordinates]);

  return (
    <EmployeesList subordinates={absence} date={date}>
      {" "}
      <EmployeeAbsenceInf />
    </EmployeesList>
  );
};

export default EmployeesAbsence;
