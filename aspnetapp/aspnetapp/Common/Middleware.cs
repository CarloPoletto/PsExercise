using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace PsExcercise;

public class Middleware {

    private readonly RequestDelegate _next;

    public Middleware(RequestDelegate next) {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context) {
        try {
            await _next(context);
            Log(context);
        }

        catch (UnauthorizedAccessException ex) {
            await HandleExceptionAsync(context, StatusCodes.Status401Unauthorized, ex);
            Log(context, ex);
        }

        catch (Exception ex) {
            await HandleExceptionAsync(context, StatusCodes.Status500InternalServerError, ex);
            Log(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, int statusCode, Exception exception) {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        var response = new { error = exception.Message };
        return context.Response.WriteAsJsonAsync(response);
    }

    private static void Log(HttpContext context, Exception? exception = null) {
        Console.WriteLine($"[PsExcercise] [{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}] [{context.Request.Method}] [Status {context.Response.StatusCode}] {context.Request.Path}");
        
        if(exception != null) {
            Console.WriteLine();
            Console.WriteLine("Error Message: " + exception.Message);
            Console.WriteLine("Stack Trace: " + exception.StackTrace);
            Console.WriteLine();
        }
    }
}