
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using StartFromScratch.Entities;
namespace StartFromScratch.Authorization;
public interface IJwtUtil
{
    public string GenerateToken(User _user);
    public int? ValidationAndGetUserIdFromToken(string token);
}
public class JwtUtil : IJwtUtil
{
    private readonly IConfiguration  _configuration;
    private readonly byte[] secretKey;
    private readonly string key = "e2bx/RvSFk}%5)]Mba!.XD?CDw(}{}wYD+zq(Uk!p+xP5R8YBu";
    public JwtUtil(IConfiguration configuration)
    {
        _configuration = configuration;
        secretKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? key);
    }
    public string GenerateToken (User _user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor 
        {
            Subject = new ClaimsIdentity ( new [] { new Claim("ID", _user.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = new SigningCredentials (new SymmetricSecurityKey(secretKey),SecurityAlgorithms.HmacSha256Signature)
        };
        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }

    public int? ValidationAndGetUserIdFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        try {
            tokenHandler.ValidateToken(token, new TokenValidationParameters {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero,
            }, out SecurityToken validatedToken) ;  
            var jwtToken = (JwtSecurityToken)validatedToken;
            var userID = int.Parse(jwtToken.Claims.First(x => x.Type == "ID").Value);
            return userID;
        }
        catch {
            return null;
        }
    }
}