namespace PsExcercise;

class HttpError : Exception {

    public int StatusCode { get; }

    public HttpError(int statusCode, string message) : base(message) {
        this.StatusCode = statusCode;
    }
}

class HttpError401Unauthorized : HttpError {
    public HttpError401Unauthorized() : this("Unauthorized") {}
    public HttpError401Unauthorized(string message) : base(401, message) {}
}

class HttpError404NotFound : HttpError {
    public HttpError404NotFound() : this("Not Found") {}
    public HttpError404NotFound(string message) : base(404, message) {}
}

class HttpError409Conflic : HttpError {
    public HttpError409Conflic() : this("Conflic") {}
    public HttpError409Conflic(string message) : base(409, message) {}
}