export function getAppointmentsForDay(state, selected) {
  console.log('STATE APP: ', state.appointments);
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