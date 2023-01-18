import DayList from "./DayList";
import React from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
} from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const appointmentList = getAppointmentsForDay(state, state.day);
  const interviewerList = getInterviewersForDay(state, state.day);

  const schedule = appointmentList.map((appointment) => {
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        interviewers={interviewerList}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={(day) => setDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
