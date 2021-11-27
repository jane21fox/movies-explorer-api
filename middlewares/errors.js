const { errMsg } = require('../utils/const');

const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500 ? errMsg.defaultServerErr : message,
    });

  return next();
};

module.exports = {
  handleErrors,
};
