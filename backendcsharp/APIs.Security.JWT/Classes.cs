namespace APIs.Security.JWT;

public class User
{
    public int? id { get; set; }
    public string? email { get; set; }
    public string? senha { get; set; }
}

public class TokenConfigurations
{
    public string? Audience { get; set; }
    public string? Issuer { get; set; }
    public int Seconds { get; set; }
    public string? SecretJwtKey { get; set; }
}

public class AccessToken
{
    public int? Id { get; set; }
    public bool Authenticated { get; set; }
    public string? Created { get; set; }
    public string? Expiration { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }
}