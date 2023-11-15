import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { getAbsenceAPI } from "../../../../api/ecpApi";
import { getAcceptedRequestsApi } from "../../../../api/requestsApi";
import { useAuth } from "../../Login/AuthContext";
const EmployeeAbsenceInf = ({ employee, date }) => {
  const { setShowPopUpLogout, setMessage } = useAuth();
  const [absence, setAbsence] = useState([]);
  const [holidays, setHolidays] = useState([]);

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

  const getAbsence = async () => {
    try {
      const data = await getAbsenceAPI(date, employee.ID);
      console.log(data.message);
      console.log(data.data);
      return data.data;
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  const getHolidays = async () => {
    try {
      const data = await getAcceptedRequestsApi(date, employee.ID);
      console.log(data.message);
      console.log(data.data);
      return data.data;
    } catch (error) {
      setMessage(error.message);
      setShowPopUpLogout(true);
    }
  };

  useEffect(() => {
    const absenceData = getAbsence();
    const holidaysData = getHolidays();
  }, [employee]);

  return (
    <div className='d-flex absence w-100'>
      <div className='w-100'>
        {employee.Nieobecnosci.length ? (
          <>
            Standardowe
            <ListGroup as='ol' numbered>
              {employee.Nieobecnosci.map((absence) => (
                <ListGroup.Item
                  key={absence.Data}
                  as='li'
                  className='d-flex justify-content-between align-items-start absence-list-item '>
                  <div className='ms-2 me-auto text-start'>
                    <div className='fw-bold text-start'>{absence.Powod}</div>
                    {"Przepracowane godziny: " + absence.IloscGodzin}
                  </div>
                  <Badge bg='primary' pill className='absence-badge'>
                    {absence.Data}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : null}
      </div>
      <div className='w-100'>
        {employee.Urlopy.length ? (
          <>
            Zaplanowane
            <ListGroup as='ol' numbered>
              {employee.Urlopy.map((absence) => (
                <ListGroup.Item
                  key={absence.Data_Od}
                  as='li'
                  className='d-flex justify-content-between align-items-start absence-list-item'>
                  <div className='ms-2 me-auto text-start'>
                    <div className='fw-bold text-start'>{absence.Powod}</div>
                    {"Zaakceptowane przez: " +
                      absence.ImieAkceptujacego +
                      " " +
                      absence.NazwiskoAkceptujacego}
                  </div>
                  <Badge bg='primary' pill className='absence-badge'>
                    {absence.Data_Od + " / " + absence.Data_Do}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>{" "}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeAbsenceInf;
