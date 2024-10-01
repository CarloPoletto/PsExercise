using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class TaskController : AController {
    
    [HttpGet]
    [AuthorizeUser]
    public IActionResult GetAll() {
        var user = this.LoggedUser;
        var tasks = DatabaseTask.SelectAll(user.Id);
        return Ok(tasks.Select(el => new TaskDto(el)));
    }

    [HttpPost]
    [AuthorizeUser]
    public IActionResult Create([FromBody] TaskDto taskDto) {
        var user = this.LoggedUser;
        DatabaseTask.Insert(
            userId: user.Id,
            task: new Task(taskDto)
        );
        return Ok();
    }

    [HttpDelete]
    [AuthorizeUser]
    [Route("[controller]/[action]/{taskId}")]
    public IActionResult Delete(int taskId) {
        var user = this.LoggedUser;
        var task = DatabaseTask.Select(taskId);

        if(task == null)
            throw new HttpError404NotFound("The requested task was not found");

        DatabaseTask.Delete(
            userId: user.Id,
            taskId: taskId
        );

        return Ok();
    }
}