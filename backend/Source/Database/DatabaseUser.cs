using Npgsql;
using NpgsqlTypes;

namespace PsExcercise;

public static class DatabaseUser {

    public static User Select(int id) {
        NpgsqlCommand command = new NpgsqlCommand(
            $"SELECT * " +
            $"FROM \"users\" " +
            $"WHERE id = @id "
        );
        command.Parameters.AddWithValue("id", NpgsqlDbType.Integer, id);
        return Database.ExecuteRead<User>(command, npgsqlDataReader => new User(npgsqlDataReader)).SingleOrDefault();
    }

    public static User Select(string email) {
        NpgsqlCommand command = new NpgsqlCommand(
            $"SELECT * FROM \"users\" WHERE email = @email "
        );
        command.Parameters.AddWithValue("email", NpgsqlDbType.Varchar, email.Trim().ToLower());
        return Database.ExecuteRead<User>(command, npgsqlDataReader => new User(npgsqlDataReader)).SingleOrDefault();
    }

    public static User Select(string email, string password) {
        NpgsqlCommand command = new NpgsqlCommand(
            $"SELECT * FROM \"users\" " +
            $"WHERE email = @email " +
            $"AND \"password\" = crypt(@password, \"password\") "
        );
        command.Parameters.AddWithValue("email", NpgsqlDbType.Varchar, email.Trim().ToLower());
        command.Parameters.AddWithValue("password", NpgsqlDbType.Varchar, password.Trim());
        return Database.ExecuteRead<User>(command, npgsqlDataReader => new User(npgsqlDataReader)).SingleOrDefault();
    }

    public static int Insert(string email, string password)  {
        NpgsqlCommand command = new NpgsqlCommand(
            $"INSERT INTO \"users\" (" +
                $"\"email\", " +
                $"\"password\" " +
            $") VALUES (" +
                $"@email, " +
                $"crypt(@password, gen_salt('bf')) " +
            $") " +
            $"RETURNING id"
        );

        command.Parameters.AddWithValue("email", NpgsqlDbType.Varchar, email.Trim().ToLower());
        command.Parameters.AddWithValue("password", NpgsqlDbType.Varchar, password.Trim());
        return (int)Database.ExecuteScalar(command);
    }
}