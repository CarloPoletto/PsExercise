using Newtonsoft.Json;
using Npgsql;

namespace PsExcercise {

    public static class Database {

        public delegate T RecordHandler<T>(NpgsqlDataReader npgsqlDataReader);
        public static string ConnectionString { get; set; }

        /* Miscellaneous
        ===================================*/
        public static NpgsqlConnection GetConnection() {
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(Database.ConnectionString);
            dataSourceBuilder.UseJsonNet(
                new JsonSerializerSettings {
                    NullValueHandling = NullValueHandling.Ignore,
                    Formatting = Formatting.None
            });

            var dataSource = dataSourceBuilder.Build();
            return dataSource.OpenConnection();
        }

        /* Execute
        ===================================*/
        public static List<T> ExecuteRead<T>(NpgsqlCommand command, RecordHandler<T> Handler) {
            
            List<T> result = new List<T>();

            using (NpgsqlConnection connection = GetConnection()) {
                command.Connection = connection;
                NpgsqlDataReader npgsqlDataReader = command.ExecuteReader();

                while (npgsqlDataReader.Read())
                    result.Add(Handler(npgsqlDataReader));

                return result;
            }
        }

        public static object? ExecuteScalar(NpgsqlCommand command) {
            using (NpgsqlConnection connection = GetConnection()) {
                command.Connection = connection;
                return command.ExecuteScalar();
            }
        }

        public static void ExecuteNonQuery(NpgsqlCommand command) {
            ExecuteNonQuery(new List<NpgsqlCommand>(){command});
        }

        public static void ExecuteNonQuery(IEnumerable<NpgsqlCommand> commands) {
            using (NpgsqlConnection connection = GetConnection()) {
                NpgsqlTransaction transaction = connection.BeginTransaction();
                try {
                    foreach (NpgsqlCommand command in commands) {
                        command.Connection = connection;
                        command.Transaction = transaction;
                        command.ExecuteNonQuery();
                    }
                    transaction.Commit();
                }
                catch (Exception) {
                    transaction.Rollback();
                    throw;
                }
            }
        }
    }
}