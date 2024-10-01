namespace PsExcercise;

public class Middleware {

    private readonly RequestDelegate _next;

    public Middleware(RequestDelegate next) {
        _next = next;
    }

    public async System.Threading.Tasks.Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
            Log(context);
        }

        catch (HttpError ex) {
            await HandleExceptionAsync(context, ex.StatusCode, ex);
            Log(context, ex);
        }

        catch (Exception ex) {
            await HandleExceptionAsync(context, StatusCodes.Status500InternalServerError, ex);
            Log(context, ex);
        }
    }

    private static System.Threading.Tasks.Task HandleExceptionAsync(HttpContext context, int statusCode, Exception exception) {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        var response = new { error = exception.Message };
        return context.Response.WriteAsJsonAsync(response);
    }

    private static void Log(HttpContext context, Exception? exception = null) {
        Console.WriteLine($"[PsExcercise] [{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}] [Status {context.Response.StatusCode}] [{context.Request.Method}] {context.Request.Path}");
        
        if(exception != null) {
            Console.WriteLine();
            Console.WriteLine("Error Message: " + exception.Message);
            Console.WriteLine("Stack Trace: " + exception.StackTrace);
            Console.WriteLine();
        }
    }
}