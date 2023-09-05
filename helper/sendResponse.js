const sendResponse = (status, body) => ({
  status: status,
  body: body,
});

module.exports = { sendResponse };
