module.exports = (err, req, res, next) => {
    const { status, message, errors } = err;
    let validationErrors;
    if (errors) {
        validationErrors = {};
        errors.forEach((error) => (validationErrors[error.param] = error.msg));
    }
    res.status(status || 500).send({
        success: 0,
        message: message || "Server Error",
        timestamp: new Date(),
        path: req.originalUrl,
        validationErrors,
    });
};