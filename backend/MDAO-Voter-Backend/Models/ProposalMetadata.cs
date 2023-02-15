namespace MDAOVoter.Models;

public class ProposalMetadata
{
    public required uint ProposalId { get; init; }
    public required string ContentHash { get; init; }

    public required string Title { get; init; }
    public required string Description { get; init; }

    public ProposalMetadata(uint proposalId, string contentHash, string title, string description)
    {
        ProposalId = proposalId;
        ContentHash = contentHash;
        Title = title;
        Description = description;
    }
}
