using System.Globalization;
using Npgsql;

namespace PsExcercise {

    internal static class Utils {

        /* DateTime
        ===================================*/
        public static string ToNetDate(this DateTime date) {
            return date.ToString("yyyy-MM-dd");
        }

        public static string ToNetDateTime(this DateTime dateTime) {
            return dateTime.ToString("yyyy-MM-ddTHH:mm");
        }

        public static DateTime ToDateTime(this string text) {
            return DateTime.ParseExact(text, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        /* NpgsqlDataReader
        ===================================*/
        public static string GetString(this NpgsqlDataReader npgsqlDataReader, string columnName) {
            return npgsqlDataReader[columnName].ToString();
        }

        public static bool GetBool(this NpgsqlDataReader npgsqlDataReader, string columnName) {
            return Convert.ToBoolean(npgsqlDataReader[columnName]);
        }
        
        public static double GetDouble(this NpgsqlDataReader npgsqlDataReader, string columnName) {
            return Convert.ToDouble(npgsqlDataReader[columnName], CultureInfo.InvariantCulture);
        }
        
        public static int GetInt(this NpgsqlDataReader npgsqlDataReader, string columnName) {
            return Convert.ToInt32(npgsqlDataReader[columnName], CultureInfo.InvariantCulture);
        }
        
        public static DateTime GetDateTime(this NpgsqlDataReader npgsqlDataReader, string columnName) {
            return Convert.ToDateTime(npgsqlDataReader[columnName], CultureInfo.InvariantCulture);
        }
    }
}