using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class TaskController : AController {
    
    [AuthorizeUser]
    public IActionResult GetAll() {
        var user = this.LoggedUser;
        var tasks = DatabaseTask.Select(user.Id);
        return Ok(tasks.Select(el => new TaskDto(el)));
    }
}