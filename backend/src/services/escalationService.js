function escalationLevel(priority) {
  return { Critical: 3, High: 2, Medium: 1, Low: 0 }[priority] ?? 1;
}
module.exports = { escalationLevel };
