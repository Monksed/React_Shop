using System;
using System.Collections.Generic;

namespace CoreData.Models;

public partial class Product
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public long? Price { get; set; }

    public string? Image { get; set; }

    public long? Bonus { get; set; }

    public DateTime CreateDate { get; set; }

    public DateTime UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public Guid? BrandId { get; set; }

    public virtual Brand? Brand { get; set; }
}
