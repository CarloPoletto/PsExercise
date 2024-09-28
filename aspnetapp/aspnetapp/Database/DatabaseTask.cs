using Npgsql;
using NpgsqlTypes;

namespace PsExcercise;

public static class DatabaseTask {

    public static List<Task> Select(int userId) {
        NpgsqlCommand command = new NpgsqlCommand($"SELECT * FROM \"tasks\" WHERE user_id = @user_id");
        command.Parameters.AddWithValue("user_id", NpgsqlDbType.Integer, userId);
        return Database.ExecuteRead<Task>(command, npgsqlDataReader => new Task(npgsqlDataReader));
    }
}