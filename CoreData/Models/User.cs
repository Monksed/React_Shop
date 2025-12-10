using System;
using System.Collections.Generic;

namespace CoreData.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string? Username { get; set; }

    public long? TelegramId { get; set; }

    public long? Score { get; set; }

    public string? Image { get; set; }

    public string? Fio { get; set; }

    public string? Adress { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public DateTime CreateDate { get; set; }

    public DateTime UpdateDate { get; set; }

    public bool IsActive { get; set; }
}
