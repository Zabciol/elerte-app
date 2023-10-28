import React, { useState, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import "../../../styles/calender.css";
import { plLocale } from "@fullcalendar/core/locales/pl";
import interactionPlugin from "@fullcalendar/interaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

const FullCalender = (props) => {
  const calendarRef = useRef(null);

  const handleDateChange = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const formattedDate = `${year}-${month}`;
      props.setDate(formattedDate);
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
  const handleDateClick = (info) => {
    // Uzyskanie instancji kalendarza
    const calendarApi = calendarRef.current.getApi();

    // Wyszukaj segment dnia, który ma więcej niż jedno wydarzenie
    const dayEl = Array.from(
      calendarApi.el.querySelectorAll("[data-date]")
    ).find((el) => el.getAttribute("data-date") === info.dateStr);

    if (dayEl) {
      // Wyszukaj link "+x more"
      const moreLink = dayEl.querySelector(".fc-more");

      // Jeśli link istnieje, symuluj kliknięcie w niego
      if (moreLink) {
        moreLink.click();
      }
    }
  };

  return (
    <FullCalendar
      locale='pl'
      plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
      themeSystem='bootstrap'
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
      moreLinkContent={() => <FontAwesomeIcon icon={faInfo} size='lg' />}
      ref={calendarRef}
      datesSet={handleDateChange}
      dateClick={handleDateClick}
    />
  );
};

export default FullCalender;
