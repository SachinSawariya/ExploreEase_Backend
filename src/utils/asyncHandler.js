
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => {
            console.log('Error: ', error);
            next(error);
        });
    }
}

export default asyncHandler
