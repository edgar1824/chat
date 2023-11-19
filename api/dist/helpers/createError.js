class CustomError extends Error {
    constructor(status) {
        super();
        this.status = status;
    }
}
export const createError = (status, message) => {
    let err = new CustomError();
    err.message = message;
    if (!err?.status) {
        err.status = 404;
    }
    err.status = status;
    return err;
};
//# sourceMappingURL=createError.js.map