const asyncHandler = fn => (req, res, next) => {
    console.log(`Handling request to: ${req.path}`);
    return Promise.resolve(fn(req, res, next)).catch(error => {
        console.error(`Error handling request to: ${req.path}`);
        next(error);
    });
};

export {asyncHandler};