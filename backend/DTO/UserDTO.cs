namespace ShopBackend.DTO;

public class UserDTO
{
    public Guid Id { get; set; }
    public string? Username { get; set; }
    public long? TelegramId { get; set; }
    public long? Score { get; set; }
    public string? Fio { get; set; }
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Image { get; set; }
}


