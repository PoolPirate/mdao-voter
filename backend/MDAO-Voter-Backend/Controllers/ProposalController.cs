using MDAOVoter.Database;
using MDAOVoter.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MDAOVoter.Controllers;
[Route("Api/Proposals")]
[ApiController]
public class ProposalController : ControllerBase
{
    private readonly ProposalContext DbContext;

    public ProposalController(ProposalContext dbContext)
    {
        DbContext = dbContext;
    }

    [HttpGet("{proposalId}")]
    public async Task<ActionResult<ProposalMetadata>> GetMetadataAsync([FromRoute]  uint proposalId)
    {
        var metadata = await DbContext.Proposals.SingleOrDefaultAsync(x => x.ProposalId== proposalId);

        return metadata is null
            ? NotFound() 
            : Ok(metadata);
    }

    [HttpGet("/Content/{contentHash}")]
    public async Task<ActionResult<ProposalMetadata>> GetMetadataAsync([FromRoute] string contentHash)
    {
        var metadata = await DbContext.Proposals.SingleOrDefaultAsync(x => x.ContentHash == contentHash);

        return metadata is null
           ? NotFound()
           : Ok(metadata);
    }

    [HttpPost("{proposalId}")]
    public async Task<ActionResult> SubmitProposalMetadataAsync([FromRoute] uint proposalId, [FromBody][Required] ProposalMetadata metadata)
    {
        if (proposalId != metadata.ProposalId)
        {
            return BadRequest("ProposalId mismatch");
        }
        if (await DbContext.Proposals.AnyAsync(x => x.ProposalId == proposalId))
        {
            return Conflict("Already storing this proposal");
        }

        DbContext.Proposals.Add(metadata);
        await DbContext.SaveChangesAsync();
        return Ok();
    }

}
