using Npgsql;

namespace PsExcercise;

public class TaskDto {

    public int id { get; set; }
    public string creationTime { get; set; }
    public string expirationDate { get; set; }
    public int userId { get; set; }
    public string title { get; set; }
    public string description { get; set; }
    public bool completed { get; set; }
    public int priority { get; set; }

    public TaskDto() {}

    public TaskDto(Task task) {
        this.id = task.Id;
        this.creationTime = task.CreationTime.ToNetDate();
        this.expirationDate = task.CreationTime.ToNetDate();
        this.userId = task.UserId;
        this.title = task.Title;
        this.description = task.Description;
        this.completed = task.Completed;
        this.priority = task.Priority;
    }
}

public class Task {

    public int Id { get; }
    public DateTime CreationTime { get; }
    public DateTime ExpirationDate { get; }
    public int UserId { get; }
    public string Title { get; }
    public string Description { get; }
    public bool Completed { get; }
    public int Priority { get; }

    public Task(NpgsqlDataReader npgsqlDataReader) {
        this.Id = npgsqlDataReader.GetInt("id");
        this.CreationTime = npgsqlDataReader.GetDateTime("creation_time");
        this.ExpirationDate = npgsqlDataReader.GetDateTime("expiration_date");
        this.UserId = npgsqlDataReader.GetInt("user_id");
        this.Title = npgsqlDataReader.GetString("title");
        this.Description = npgsqlDataReader.GetString("description");
        this.Completed = npgsqlDataReader.GetBool("completed");
        this.Priority = npgsqlDataReader.GetInt("priority");
    }

    public Task(TaskDto taskDto) {
        this.Id = taskDto.id;
        this.CreationTime = taskDto.creationTime==null?DateTime.UtcNow:taskDto.creationTime.ToDateTime();
        this.ExpirationDate = taskDto.expirationDate==null?DateTime.UtcNow:taskDto.expirationDate.ToDateTime();
        this.UserId = taskDto.userId;
        this.Title = taskDto.title;
        this.Description = taskDto.description;
        this.Completed = taskDto.completed;
        this.Priority = taskDto.priority;
    }
}