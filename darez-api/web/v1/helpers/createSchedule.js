const weekdays = require('./weekdays');

module.exports = (preSchedule) => {
  const schedule = {};
  Object.keys(weekdays).forEach((day) => {
    schedule[`${weekdays[day]}_open`] = null;
    schedule[`${weekdays[day]}_close`] = null;
  });
  preSchedule.forEach((day) => {
    schedule[`${weekdays[day.day]}_open`] = day.open_time;
    schedule[`${weekdays[day.day]}_close`] = day.close_time;
  });
  return schedule;
};
