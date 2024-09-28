using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class UserController : Controller {

    public IActionResult Login([FromBody] LoginNto loginNto) {
        var user = DatabaseUser.Select(loginNto.email, loginNto.password);

        if(user == null)
            throw new UnauthorizedAccessException();
        
        Response.AddAuthJWT(user);
        return Ok(new UserNto(user));
    }
}