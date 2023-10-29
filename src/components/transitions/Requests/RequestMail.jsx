import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";

import { getNextWorkDay } from "../../common/CommonFunctions";

const RequestMail = (props) => {
  const {
    sender,
    reciver,
    reason,
    reasons,
    setReason,
    setStartDate,
    setMessage,
    setEndDate,
    setRequest,
    readOnly,
    message,
    startDate,
    endDate,
    children,
  } = props;

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
    }
  }, [sender, reciver]);

  return (
    <div className='request'>
      {readOnly ? (
        <CloseButton
          className='request_close-btn'
          onClick={() => setRequest(null)}
        />
      ) : null}
      {sender && reciver && startDate && endDate && reason ? (
        <>
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
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'>
              <Form.Label>Wiadomość</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
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
        </>
      ) : (
        <div>
          Trwa ładowanie...
          <Spinner animation='border' />
        </div>
      )}
    </div>
  );
};

export default RequestMail;