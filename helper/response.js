const RESPONSE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT:409,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  VALIDATION: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_MODIFIED: 304,
};

const success = (message, results, statusCode, res) => {
  res.status(RESPONSE[statusCode]).json({
    message: message,
    error: false,
    code: RESPONSE[statusCode],
    ...results,
  });
};

const error = (message, statusCode, res) => {
  res.status(RESPONSE[statusCode]).json({
    message,
    code: RESPONSE[statusCode],
    error: true,
  });
};

const validation = (errors, res) => {
  const formattedErrors = errors
    ? formateMongooseValidationError(errors)
    : "Internal server error....";
  res.status(RESPONSE.VALIDATION).json({
    message: "Validation errors",
    error: true,
    code: RESPONSE.VALIDATION,
    errors: formattedErrors,
  });
};

module.exports = {
  success,
  error,
  validation
};