import { ApiError } from "../utils/ApiError.js";

export const handleErrorResponse = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.statusCode,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    status: 500,
  });
};
