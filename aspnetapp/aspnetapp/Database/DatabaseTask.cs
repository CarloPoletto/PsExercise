using Npgsql;
using NpgsqlTypes;

namespace PsExcercise;

public static class DatabaseTask {

    public static List<Task> Select(int userId) {
        NpgsqlCommand command = new NpgsqlCommand($"SELECT * FROM \"tasks\" WHERE user_id = @user_id");
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        return Database.ExecuteRead<Task>(command, npgsqlDataReader => new Task(npgsqlDataReader));
    }

    public static void Delete(int userId, int taskId) {
        NpgsqlCommand command = new NpgsqlCommand($"DELETE FROM \"tasks\" WHERE id = @task_id AND user_id = @user_id");
        command.Parameters.AddWithValue("task_id", NpgsqlDbType.Integer, taskId);
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        Database.ExecuteNonQuery(command);
    }
}