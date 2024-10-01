using Npgsql;
using NpgsqlTypes;

namespace PsExcercise;

public static class DatabaseTask {

    public static Task Select(int taskId) {
        NpgsqlCommand command = new NpgsqlCommand($"SELECT * FROM \"tasks\" WHERE id = @task_id");
        command.Parameters.AddWithValue("task_id", NpgsqlDbType.Integer, taskId);
        return Database.ExecuteRead<Task>(command, npgsqlDataReader => new Task(npgsqlDataReader)).SingleOrDefault();
    }

    public static List<Task> SelectAll(int userId) {
        NpgsqlCommand command = new NpgsqlCommand($"SELECT * FROM \"tasks\" WHERE user_id = @user_id ORDER BY creation_time DESC");
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        return Database.ExecuteRead<Task>(command, npgsqlDataReader => new Task(npgsqlDataReader));
    }

    public static void Delete(int userId, int taskId) {
        NpgsqlCommand command = new NpgsqlCommand($"DELETE FROM \"tasks\" WHERE id = @task_id AND user_id = @user_id");
        command.Parameters.AddWithValue("task_id", NpgsqlDbType.Integer, taskId);
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        Database.ExecuteNonQuery(command);
    }

    public static void Insert(int userId, Task task)  {
        NpgsqlCommand command = new NpgsqlCommand(
            $"INSERT INTO \"tasks\" (" +
                $"\"expiration_date\", " +
                $"\"user_id\", " +
                $"\"title\", " +
                $"\"description\", " +
                $"\"completed\", " +
                $"\"priority\" " +
            $") VALUES (" +
                $"@expiration_date, " +
                $"@user_id, " +
                $"@title, " +
                $"@description, " +
                $"@completed, " +
                $"@priority " +
            $") " +
            $"RETURNING id"
        );

        command.Parameters.AddWithValue("expiration_date", NpgsqlDbType.Date, task.ExpirationDate);
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        command.Parameters.AddWithValue("title", NpgsqlDbType.Varchar, task.Title);
        command.Parameters.AddWithValue("description", NpgsqlDbType.Varchar, task.Description);
        command.Parameters.AddWithValue("completed", NpgsqlDbType.Boolean, task.Completed);
        command.Parameters.AddWithValue("priority", NpgsqlDbType.Integer, task.Priority);
        Database.ExecuteNonQuery(command);
    }
}