// Error handler class 
class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode

        ErrorHandler.captureStackTrace(this, this.constructor)
    }
} 

module.exports = ErrorHandler;