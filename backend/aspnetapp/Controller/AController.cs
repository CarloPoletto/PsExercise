using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class AController : Controller {

    protected User LoggedUser { get => HttpContext.Request.GetLoggedUser(); }
}