export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function normalizePrismaError(error) {
  if (error?.name === "PrismaClientInitializationError") {
    return { status: 503, message: "Database is unavailable. Please try again." };
  }
  if (error?.code === "P2002") {
    return { status: 409, message: "Duplicate record. A unique field already exists." };
  }
  if (error?.code === "P2003") {
    return { status: 400, message: "Related record does not exist." };
  }
  if (error?.code === "P2025") {
    return { status: 404, message: "Record not found." };
  }
  return null;
}
