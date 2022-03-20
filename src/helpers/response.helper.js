const buildResp = (status, message, data, error) => {
    return {
        status: status,
        message: message,
        data: data,
        error: error
    }
}

module.exports = {
    buildResp
}