import React, { useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { getNextWorkDay } from "../../common/CommonFunctions";

const RequestFormBase = ({
  user,
  mySupervisor,
  reason,
  reasons,
  setReason,
  children,
  readOnly,
}) => {
  const textareaRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

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
    if (!readOnly) {
      const nextWorkDay = getNextWorkDay();
      const dayAfter = new Date(nextWorkDay);
      dayAfter.setDate(dayAfter.getDate() + 1);

      startDateRef.current.value = nextWorkDay.toISOString().split("T")[0];
      endDateRef.current.value = dayAfter.toISOString().split("T")[0];
    }
  }, [readOnly]);

  return (
    <div className='request'>
      {/* ... (reszta kodu, identyczna jak w Twoim pierwotnym komponencie, ale z usuniętą logiką przycisku) */}
      {children} // To miejsce pozwoli nam na dodanie dodatkowych elementów w
      innych komponentach.
    </div>
  );
};

export default RequestFormBase;
