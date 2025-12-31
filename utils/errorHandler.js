class AppError extends Error{
    constructor(message , statusCode) {
       super(message)
       this.statusCode = statusCode 
       this.isOperational = true //what does this do ?
    }
}


export {AppError}