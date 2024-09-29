using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class UserController : AController {

    [AuthorizeAll]
    public IActionResult SignUp([FromBody] SignUpDto signUpDto) {
        var userPrev = DatabaseUser.Select(signUpDto.email, signUpDto.password);

        if(userPrev != null)
            return Conflict();

        var userId = DatabaseUser.Insert(signUpDto.email, signUpDto.password);
        var user = DatabaseUser.Select(userId);
        Response.InsertJWT(user);
        return Ok();
    }

    [AuthorizeAll]
    public IActionResult SignIn([FromBody] SignInDto loginNto) {
        var user = DatabaseUser.Select(loginNto.email, loginNto.password);

        if(user == null)
            throw new UnauthorizedAccessException();
        
        Response.InsertJWT(user);
        return Ok();
    }

    [AuthorizeUser]
    public new IActionResult SignOut() {
        Response.DeleteJWT();
        return Ok();
    }

    [AuthorizeAll]
    public IActionResult GetLoggedUser() {
        var user = LoggedUser;

        if(user == null)
            return Ok(null);
        
        return Ok(new UserNto(user));
    }
}