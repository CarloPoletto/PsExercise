using System.Text.Json.Serialization;
using PsExcercise;

// WebApplicationBuilder
//-----------------------
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddHealthChecks();

Cookie.ConfigSection = builder.Configuration.GetSection("JwtConfiguration");
Database.ConnectionString = builder.Configuration.GetSection("Database")["Connection"];

// WebApplication
//-----------------------
var app = builder.Build();
app.MapHealthChecks("/healthz");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapRazorPages();
app.UseMiddleware<Middleware>();

CancellationTokenSource cancellation = new();

app.Lifetime.ApplicationStopping.Register(() => { cancellation.Cancel(); });
app.MapGet("/Environment", () => new EnvironmentInfo());
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();

[JsonSerializable(typeof(EnvironmentInfo))]
[JsonSerializable(typeof(Operation))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{
}

public record struct Operation(int Delay);
