using Common.Configuration;
using System.ComponentModel.DataAnnotations;

namespace MDAOVoter.Configuration;

public class DatabaseOptions : Option
{
    [Required]
    public string AppConnectionString { get; set; } = null!;
}
