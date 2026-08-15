// This middleware acts as a global error handler for the application.
// It captures errors thrown in the application and sends a structured JSON response to the client.
import { APIError } from "../utils/APIError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            message: err.message,
            success: false,
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
        success: false,
    });
};

export default errorHandler;