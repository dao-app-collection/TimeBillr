class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  console.log("|||||||||||||||||In error handling function |||||||||||||");

  const { statusCode, message } = err;
  console.log(statusCode + message);
  res.status(statusCode).send({
    statusCode,
    message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
