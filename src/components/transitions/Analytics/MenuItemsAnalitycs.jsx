import React, { useState, useEffect } from "react";
import { SelectItems } from "../../layout/Menu/MenuForms";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const MenuItemsAnalitycs = React.memo(
  ({
    dzial,
    dzialy,
    setDzial,
    position,
    positions,
    setPosition,
    handleChange,
  }) => {
    console.log(position);
    console.log(dzial);
    console.log(positions);
    console.log(dzialy);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuItems, setmenuItems] = useState();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const MenuRender = (
      <div className='analytics-filter'>
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
            options={dzialy.map((s, index) => ({
              value: s,
              label: s,
            }))}
            value={
              Array.isArray(dzial)
                ? dzial.map((d) => ({ value: d, label: d }))
                : []
            }
            onChange={(selected) =>
              handleChange(selected, setDzial, (option) => option.value)
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
            <Button variant='secondary' onClick={handleShow} className='me-2'>
              Filtruj
            </Button>
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement={"end"}
              className='background text-white'>
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
