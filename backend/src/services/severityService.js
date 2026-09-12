function getSlaHours(priority) {
  return { Critical: 4, High: 12, Medium: 24, Low: 72 }[priority] || 24;
}
module.exports = { getSlaHours };
