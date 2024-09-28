using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PsExcercise;

public static class Cookie {

    public static IConfigurationSection ConfigSection { get; set; }

    public static string Issuer { get => Cookie.ConfigSection["Issuer"]; }
    public static string Audience { get => Cookie.ConfigSection["Audience"]; }
    public static string SecretKey { get => Cookie.ConfigSection["SecretKey"]; }

    public static void AddAuthJWT(this HttpResponse Response, User user) {
        
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
        Response.Cookies.Append("psexcercise", jwtToken, cookieOptions);
    }
}