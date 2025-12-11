namespace ShopBackend.DTO;

public class ProductDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? Price { get; set; }
    public string? Image { get; set; }
    public long? Bonus { get; set; }
    public Guid? BrandId { get; set; }
}