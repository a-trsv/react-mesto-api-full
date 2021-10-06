const winston = require('winston')
const expressWinston = require('express-winston')
const { request } = require('express')

// create logger for requests

const requestLogger = expressWinston.logger({
    // option -> where write log
    transports: [
        new winston.transports.File({ filename: 'request.log' }),
    ],
    // format type for requests
    format: winston.format.json(),
})


// create logger for errors

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({filename: 'error.log'}),
    ],
    format: winston.format.json(),
})

module.exports = {
    requestLogger,
    errorLogger,
}