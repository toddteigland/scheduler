import DayList from "./DayList";
import React, { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import axios from 'axios';
import { getAppointmentsForDay } from "helpers/selectors";



export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers:{}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);


  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState({...state, days});
  // const [day, setDay] = useState('Monday');
  // const [days, setDays] = useState([]);



  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((all) => {
      console.log('RESPONSE:', all[2]);
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})) 
    });
  }, []);





  const appointmentList = getAppointmentsForDay(state, state.day).map(appointment => {
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
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
            onChange={day => setDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />

      </section>
    </main>
  );
}
