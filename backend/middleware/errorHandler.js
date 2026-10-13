/**
 * Central error handler middleware.
 * Catches any error passed via next(err) and returns a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[PitStop Error] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
