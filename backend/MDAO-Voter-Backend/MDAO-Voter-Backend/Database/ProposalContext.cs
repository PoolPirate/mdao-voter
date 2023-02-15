using MDAOVoter.Models;
using Microsoft.EntityFrameworkCore;

namespace MDAOVoter.Database;

public class ProposalContext : DbContext
{
    public DbSet<ProposalMetadata> Proposals { get; set; }

    public ProposalContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProposalMetadata>(b =>
        {
            b.Property(x => x.ProposalId);
            b.HasKey(x => x.ProposalId);

            b.Property(x => x.ContentHash);
            b.HasIndex(x => x.ContentHash);

            b.Property(x => x.Title);
            b.Property(x => x.Description);

            b.ToTable("Proposals");
        });
    }
}
