using Npgsql;

namespace PsExcercise;

public class UserNto {

    public int id { get; set; }
    public string creationTime { get; set; }
    public string email { get; set; }

    public UserNto() {}

    public UserNto(User user) {
        this.id = user.Id;
        this.creationTime = user.CreationTime.ToNetDate();
        this.email = user.Email;
    }
}

public class User {

    public int Id { get; }
    public DateTime CreationTime { get; }
    public string Email { get; }

    public User(NpgsqlDataReader npgsqlDataReader) {
        this.Id = npgsqlDataReader.GetInt("id");
        this.CreationTime = npgsqlDataReader.GetDateTime("creation_time");
        this.Email = npgsqlDataReader.GetString("email");
    }

    public User(UserNto userNto) {
        this.Id = userNto.id;
        this.CreationTime = userNto.creationTime==null?DateTime.UtcNow:userNto.creationTime.ToDateTime();
        this.Email = userNto.email;
    }
}