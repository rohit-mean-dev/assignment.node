module.exports = function successResponse(res, data, message) {
    const finalResponse = {
        success: 1,
        message,
        data,
    };
    res.send(finalResponse);
};