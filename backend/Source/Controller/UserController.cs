using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class UserController : AController {

    [HttpPost]
    [AuthorizeAll]
    public IActionResult SignUp([FromBody] SignUpDto signUpDto) {
        var userPrev = DatabaseUser.Select(signUpDto.email);

        if(userPrev != null)
            throw new HttpError409Conflic("The email address is already registered.");

        var userId = DatabaseUser.Insert(signUpDto.email, signUpDto.password);
        var user = DatabaseUser.Select(userId);
        Response.InsertJWT(user);
        return Ok();
    }

    [HttpPost]
    [AuthorizeAll]
    public IActionResult SignIn([FromBody] SignInDto loginNto) {
        var user = DatabaseUser.Select(loginNto.email, loginNto.password);

        if(user == null)
            throw new HttpError401Unauthorized();
        
        Response.InsertJWT(user);
        return Ok();
    }

    [HttpPost]
    [AuthorizeUser]
    public new IActionResult SignOut() {
        Response.DeleteJWT();
        return Ok();
    }

    [HttpGet]
    [AuthorizeAll]
    public IActionResult GetLoggedUser() {
        var user = LoggedUser;

        if(user == null)
            return Ok();
        
        return Ok(new UserNto(user));
    }
}