using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class UserController : AController {

    [AuthorizeAll]
    public IActionResult Login([FromBody] LoginNto loginNto) {
        var user = DatabaseUser.Select(loginNto.email, loginNto.password);

        if(user == null)
            throw new UnauthorizedAccessException();
        
        Response.AddAuthJWT(user);
        return Ok();
    }
}