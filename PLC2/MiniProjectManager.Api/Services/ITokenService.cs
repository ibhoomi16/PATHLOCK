namespace MiniProjectManager.Api.Services
{
    public interface ITokenService
    {
        string CreateToken(int userId, string username);
    }
}
