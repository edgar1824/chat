class CustomError extends Error {
  status?: number;
  constructor(status?: number) {
    super();
    this.status = status;
  }
}

export const createError = (status: number, message: string) => {
  let err = new CustomError();
  err.message = message;
  if (!err?.status) {
    err.status = 404;
  }
  err.status = status;
  return err;
};
