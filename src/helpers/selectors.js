import Appointment from "components/Appointment";

export function getAppointmentsForDay(state, selected) {
  const filteredDays = state.days.filter(day => day.name === selected);
  if (state.days.length === 0 || filteredDays.length === 0) {
    return [];
  }
  const foundAppointments = filteredDays[0].appointments;
  const result = foundAppointments.map(id => {
    return state.appointments[id];
  });
  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}
