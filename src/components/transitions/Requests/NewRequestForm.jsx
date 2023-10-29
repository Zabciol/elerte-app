import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import LoadingButton from "../../common/LoadingBtn";
import { newRequestApi } from "../../../api/requestsApi";
import { getNextWorkDay } from "../../common/CommonFunctions";

const NewRequestForm = ({ user, mySupervisor, reason, reasons, setReason }) => {
  const textareaRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const sentRequest = async () => {
    const request = {
      senderID: user.ID,
      reciverID: mySupervisor.ID,
      message: textareaRef.current.value,
      reasonID: reason.ID,
      dataOd: startDateRef.current.value,
      dataDo: endDateRef.current.value,
    };

    console.log("Sending");
    console.log(request);
    try {
      const response = await newRequestApi(request);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleStartDateChange = () => {
    const startDate = new Date(startDateRef.current.value);
    const endDate = new Date(endDateRef.current.value);

    if (endDate <= startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      endDateRef.current.value = newEndDate.toISOString().split("T")[0];
    }
  };

  useEffect(() => {
    const nextWorkDay = getNextWorkDay();
    const dayAfter = new Date(nextWorkDay);
    dayAfter.setDate(dayAfter.getDate() + 1);

    startDateRef.current.value = nextWorkDay.toISOString().split("T")[0];
    endDateRef.current.value = dayAfter.toISOString().split("T")[0];
  }, []);

  return (
    <div className='request'>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Od:</InputGroup.Text>
        <Form.Control
          value={user.Mail}
          aria-label='Username'
          aria-describedby='basic-addon1'
          readOnly={true}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Do:</InputGroup.Text>
        <Form.Control
          aria-label='Text input with dropdown button'
          value={mySupervisor.Mail}
          readOnly={true}
        />
      </InputGroup>
      <Form>
        <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Wiadomość</Form.Label>
          <Form.Control as='textarea' rows={3} ref={textareaRef} />
        </Form.Group>
      </Form>
      <div className='request-dates'>
        <InputGroup className='mb-3 request-date'>
          <InputGroup.Text id='basic-addon1'>Od:</InputGroup.Text>
          <Form.Control
            aria-label='Text input with dropdown button'
            type='date'
            ref={startDateRef}
            onChange={handleStartDateChange}
          />
        </InputGroup>
        <InputGroup className='mb-3 request-date'>
          <InputGroup.Text id='basic-addon1'>Do:</InputGroup.Text>
          <Form.Control
            aria-label='Text input with dropdown button'
            type='date'
            ref={endDateRef}
          />
        </InputGroup>
      </div>
      <div className='request-bottom-form'>
        <Form.Select
          aria-label='Default select example'
          onChange={setReason}
          className='request-select'>
          {reasons.map((item, index) => (
            <option value={index} key={index}>
              {item.Nazwa}
            </option>
          ))}
        </Form.Select>
        <LoadingButton action={sentRequest} buttonText={"Wyslij"} />
      </div>
    </div>
  );
};

export default NewRequestForm;
