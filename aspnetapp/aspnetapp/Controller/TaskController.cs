using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class TaskController : AController {
    
    [AuthorizeUser]
    public IActionResult GetAll() {
        var user = this.LoggedUser;
        var tasks = DatabaseTask.Select(user.Id);
        return Ok(tasks.Select(el => new TaskDto(el)));
    }

    [AuthorizeUser]
    public IActionResult Create([FromBody] TaskDto taskDto) {
        var user = this.LoggedUser;
        DatabaseTask.Insert(
            userId: user.Id,
            task: new Task(taskDto)
        );
        return Ok();
    }

    [AuthorizeUser]
    [Route("[controller]/[action]/{taskId}")]
    public IActionResult Delete(int taskId) {
        var user = this.LoggedUser;
        DatabaseTask.Delete(
            userId: user.Id,
            taskId: taskId
        );
        return Ok();
    }
}