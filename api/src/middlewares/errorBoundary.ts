export const errorBoundary = (err, req, res, next) => {
  const { status = 500, message = "Something went wrong", stack } = err;
  return res.status(status).json({ success: false, status, message, stack });
};
