import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import { newRequestApi } from "../../../api/requestsApi";
import { getNextWorkDay } from "../../common/CommonFunctions";

const RequestMail = ({
  sender,
  reciver,
  reason,
  reasons,
  setReason,
  setStartDate,
  setMessage,
  setEndDate,
  readOnly,
  message,
  startDate,
  endDate,
  children,
}) => {
  const textareaRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const sentRequest = async () => {
    const request = {
      senderID: sender.ID,
      reciverID: reciver.ID,
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

  const handleStartDateChange = (e) => {
    const startDateValue = new Date(e.target.value);
    const endDateValue = new Date(endDate);

    if (endDateValue <= startDateValue) {
      const newEndDate = new Date(startDateValue);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate.toISOString().split("T")[0]);
    }
    setStartDate(e.target.value);
  };

  useEffect(() => {
    if (readOnly === false) {
      const nextWorkDay = getNextWorkDay();
      const dayAfter = new Date(nextWorkDay);
      dayAfter.setDate(dayAfter.getDate() + 1);

      setStartDate(nextWorkDay.toISOString().split("T")[0]);
      setEndDate(dayAfter.toISOString().split("T")[0]);
    } else {
      //textareaRef.current.value = message;
      //startDateRef.current.value = startDate;
      //endDateRef.current.value = endDate;
    }
  }, [sender, reciver]);

  return (
    <div className='request'>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Od:</InputGroup.Text>
        <Form.Control
          value={sender.Mail}
          aria-label='Username'
          aria-describedby='basic-addon1'
          readOnly={true}
        />
      </InputGroup>
      <InputGroup className='mb-3'>
        <InputGroup.Text id='basic-addon1'>Do:</InputGroup.Text>
        <Form.Control
          aria-label='Text input with dropdown button'
          value={reciver.Mail}
          readOnly={true}
        />
      </InputGroup>
      <Form>
        <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Wiadomość</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            //ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            readOnly={readOnly}
          />
        </Form.Group>
      </Form>
      <div className='request-dates'>
        <InputGroup className='mb-3 request-date'>
          <InputGroup.Text id='basic-addon1'>Od:</InputGroup.Text>
          <Form.Control
            aria-label='Text input with dropdown button'
            type='date'
            //ref={startDateRef}
            value={startDate}
            onChange={handleStartDateChange}
            readOnly={readOnly}
          />
        </InputGroup>
        <InputGroup className='mb-3 request-date'>
          <InputGroup.Text id='basic-addon1'>Do:</InputGroup.Text>
          <Form.Control
            aria-label='Text input with dropdown button'
            type='date'
            //ref={endDateRef}
            value={endDate}
            readOnly={readOnly}
          />
        </InputGroup>
      </div>
      <div className='request-bottom-form'>
        <Form.Select
          aria-label='Default select example'
          value={reason.Nazwa}
          onChange={(e) => setReason(e.target.value)}
          className='request-select'
          readOnly={readOnly}>
          {reasons.map((item, index) => (
            <option value={item} key={index}>
              {item.Nazwa}
            </option>
          ))}
        </Form.Select>
        {children}
      </div>
    </div>
  );
};

export default RequestMail;
