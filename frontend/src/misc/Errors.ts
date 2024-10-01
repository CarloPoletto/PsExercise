export class ToastError extends Error {
    constructor(message: string = "There was an unexpected error.") {
        super(message);
    }
}

export class NotImplementedError extends Error {
    constructor(message: string = "This feature has not yet been implemented.") {
        super(message);
    }
}