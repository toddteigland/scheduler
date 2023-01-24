//Checks the day array in state to make sure its not empty, then matches it against the
//Given the current 'selected' day. It then returns the appointments for that day 
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


//Does the same as the above function but for interviewers
export function getInterviewersForDay(state, selected) {
  const filteredDays = state.days.filter(day => day.name === selected);
  if (state.days.length === 0 || filteredDays.length === 0) {
    return [];
  }
  const foundInterviewers = filteredDays[0].interviewers;
  const result = foundInterviewers.map(id => {
    return state.interviewers[id];
  });
  return result;
}

//Checks if there is a currently booked interview, if not, shows the list of interviews and the imput for student name
export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}