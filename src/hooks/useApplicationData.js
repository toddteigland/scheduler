import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  const updateSpots = (appointments, id) => {
    const foundDay = state.days.find(day => state.day === day.name)
    // const foundDay = state.days.find(day => day.appointments.includes(id))
    let spots = 0;
    for (let appointmentID of foundDay.appointments) {
      if (appointments[appointmentID].interview === null) {
        spots += 1;
      }
    }
    return state.days.map((day) => {
      if (state.day === day.name) {
        return { ...day, spots}
      }
      else {
        return day
      }
    });
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    console.log("STATE: ", state);

    return axios.put(`api/appointments/${id}`, { interview }).then((res) => {
      setState({
        ...state,
        appointments,
        days: updateSpots(appointments, id)
      });
    });
  };

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`api/appointments/${id}`, {}).then((res) => {
      setState({
        ...state,
        appointments,
        days: updateSpots(appointments, id)

      });
    });
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
