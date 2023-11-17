import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { vacationApi } from "../../../api/userApi";

const Leaves = ({ user, date }) => {
  const [zalegle, setZalegle] = useState(0);
  const [tegoroczne, setTegoroczne] = useState(0);
  const [wykorzystane, setWykorzystane] = useState(0);

  const getData = async () => {
    const data = await vacationApi(user.ID);
    console.log(data);
    setZalegle(data.data.ZaleglyUrlop);
    setTegoroczne(data.data.TegorocznyUrlop);
    setWykorzystane(data.data.Wykorzystane);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className='p-5 pt-0 text-white'>
      <h3>Urlopy</h3>
      <div className='d-flex flex-wrap justify-content-between align-items-top w-100'>
        <div className='home-presence_data'>
          <Table responsive='lg' bordered>
            <thead>
              <tr>
                <th className='w-25'>Zaległe</th>
                <th className='w-25'>Tegoroczne</th>
                <th className='w-25'>Wykorzystane</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{zalegle}</td>
                <td>{tegoroczne}</td>
                <td>{wykorzystane}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Leaves;
