using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PsExcercise;

public static class Cookie {

    public const string COOKIE_NAME = "psexcercise";

    public static IConfigurationSection ConfigSection { get; set; }

    public static string Issuer { get => Cookie.ConfigSection["Issuer"]; }
    public static string Audience { get => Cookie.ConfigSection["Audience"]; }
    public static string SecretKey { get => Cookie.ConfigSection["SecretKey"]; }

    public static void InsertJWT(this HttpResponse Response, User user) {
        
        // 1. Create security key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Cookie.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // 2. Create the JWT
        var token = new JwtSecurityToken(
            issuer: Cookie.Issuer,
            audience: Cookie.Audience,
            claims: new[] {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            },
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds
        );

        var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

        // 3. Create cookie options
        var cookieOptions = new CookieOptions {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.Now.AddMinutes(30)
        };

        // 4. Add the JWT to the response as a cookie
        Response.Cookies.Append(COOKIE_NAME, jwtToken, cookieOptions);
    }
    
    public static void DeleteJWT(this HttpResponse Response) {
        Response.Cookies.Delete(COOKIE_NAME);
    }

    public static User GetLoggedUser(this HttpRequest Request) {
        try {
            var jwtToken = Request.Cookies[COOKIE_NAME];

            if (string.IsNullOrEmpty(jwtToken)) {
                throw new Exception("JWT cookie is missing.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = tokenHandler.ReadJwtToken(jwtToken);
            var userIdClaim = jwtSecurityToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);

            if (userIdClaim == null) {
                throw new Exception("User ID claim not found in JWT.");
            }

            var userId = int.Parse(userIdClaim.Value);
            return DatabaseUser.Select(userId);
        }

        catch (Exception) {
            return null;
        }
    }
}