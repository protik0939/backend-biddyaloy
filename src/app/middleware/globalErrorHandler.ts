import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type TErrorSource = {
  path: string;
  message: string;
};

export const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: TErrorSource[] = [];

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error instanceof Error) {
    const statusFromError = (error as Error & { statusCode?: number }).statusCode;
    if (typeof statusFromError === "number") {
      statusCode = statusFromError;
    }
    message = error.message;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
