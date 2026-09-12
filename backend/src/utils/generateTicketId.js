let counter = 109;
function generateTicketId() {
  counter += 1;
  return `CF${counter}`;
}
module.exports = generateTicketId;
