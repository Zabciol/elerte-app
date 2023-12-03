import React, { useState, useEffect } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuItemsAnalitycs = React.memo(
  ({
    selectedDepartments,
    departments,
    setSelectedDepartments,
    position,
    positions,
    setPosition,
    allMonths,
    selectedMonths,
    setSelectedMonths,
    handleChange,
  }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    const [menuItems, setmenuItems] = useState();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1200);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const MenuRender = (
      <div className='analytics-filter'>
        {selectedMonths ? (
          <div className='mb-3 select-react-position form-group'>
            <label
              htmlFor='monthsSelect'
              className='form-label select-react-position-label'>
              Miesiące
            </label>
            <Select
              id='monthsSelect'
              isMulti={true}
              options={allMonths}
              value={selectedMonths}
              onChange={(selected) =>
                handleChange(selected, setSelectedMonths, (option) => option)
              }
            />
          </div>
        ) : null}
        {position ? (
          <div className='mb-3 select-react-position form-group'>
            <label
              htmlFor='supervisorSelect'
              className='form-label select-react-position-label'>
              Stanowiska
            </label>
            <Select
              id='supervisorSelect'
              isMulti
              options={positions.map((s, index) => ({
                value: s.ID,
                label: s.Nazwa,
                dzial: s.Dzial_ID,
              }))}
              value={
                Array.isArray(position)
                  ? position.map((d) => ({ value: d.ID, label: d.Nazwa }))
                  : []
              }
              onChange={(selected) =>
                handleChange(selected, setPosition, (option) => ({
                  ID: option.value,
                  Nazwa: option.label,
                  Dzial_ID: option.dzial,
                }))
              }
            />
          </div>
        ) : null}

        <div className='mb-3 select-react-position form-group'>
          <label
            htmlFor='supervisorSelect'
            className='form-label select-react-position-label'>
            Działy
          </label>
          <Select
            id='supervisorSelect'
            isMulti
            options={departments.map((s, index) => ({
              value: s.ID,
              label: s.nazwa,
            }))}
            value={
              Array.isArray(selectedDepartments)
                ? selectedDepartments.map((d) => ({
                    value: d.ID,
                    label: d.nazwa,
                  }))
                : []
            }
            onChange={(selected) =>
              handleChange(selected, setSelectedDepartments, (option) => ({
                ID: option.value,
                nazwa: option.label,
              }))
            }
          />
        </div>
      </div>
    );

    return (
      <>
        {isMobile ? (
          <> {MenuRender}</>
        ) : (
          <>
            <i
              class='bi bi-filter-right'
              onClick={handleShow}
              style={{
                height: "10px",
                width: "50px",
                transform: "scale(3)",
                cursor: "pointer",
              }}></i>
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement={"end"}
              className='background text-white'
              style={{ width: "30%" }}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filtruj</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>{MenuRender}</Offcanvas.Body>
            </Offcanvas>
          </>
        )}
      </>
    );
  }
);

export default MenuItemsAnalitycs;
