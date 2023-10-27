import React, { useState, useRef } from "react";
//import "../CSS/calender.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { plLocale } from "@fullcalendar/core/locales/pl";
import interactionPlugin from "@fullcalendar/interaction";

const FullCalender = (props) => {
  const calendarRef = useRef(null);

  const handleDateChange = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const formattedDate = `${year}-${month}`;
      //props.changeDate(formattedDate);
    }
  };

  const renderEventContent = (eventInfo) => {
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(eventInfo.event.end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              marginRight: "5px",
              backgroundColor: eventInfo.event.backgroundColor,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
            }}></div>
          <div>
            <b>
              {startTime} - {endTime}
            </b>
            <i> {eventInfo.event.title}</i>
          </div>
        </div>
      </>
    );
  };
  return (
    <div className='card-content calender'>
      <FullCalendar
        locale='pl'
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={props.events}
        height='500px'
        selectable={true}
        selectMirror={true}
        dayMaxEvents={0}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        eventContent={renderEventContent}
        ref={calendarRef}
        datesSet={handleDateChange}
      />
    </div>
  );
};

export default FullCalender;
