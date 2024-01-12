import { ErrorResponse } from "../utilities/error";

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for the developer
    console.log(err);

    // Sequelize bad/invalid association error
    if(err.name === 'SequelizeAssociationError') {
        const message = `Invalid association`;
        error = new ErrorResponse(message, 400);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Sequelize validation error 
    if(err.name === 'SequelizeValidationError') {
        const message = err.errors.map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server error'
    });
}

export default errorHandler;