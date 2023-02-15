//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract XMetricVoter {
    enum VoteType {
        None,
        Yes,
        No
    }
    enum ProposalStatus {
        None,
        Accepted,
        Rejected
    }

    struct Proposal {
        mapping(VoteType => uint256) voteCounts;
        bytes32 contentHash;
        address submitter;
        uint64 deadline;
        ProposalStatus status;
    }
    struct Vote {
        VoteType voteType;
        uint256 amount;
    }

    error InsufficientBalance(uint256 requiredBalance, uint256 actualBalance);
    error InvalidVoteType();
    error AlreadyVotedFor(VoteType voteType, uint256 amount);
    error VotingEnded(
        uint256 votingDeadlineTimestamp,
        uint256 currentTimestamp
    );
    error InvalidProposalId(uint32 proposalId);

    event ProposalSubmitted(uint32 indexed proposalId);
    event VoteSubmitted(
        uint32 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 amount
    );
    event VoteUpdated(
        uint32 indexed proposalId,
        address indexed voter,
        VoteType previousVoteType,
        VoteType currentVoteType,
        uint256 previousAmount,
        uint256 currentAmount
    );

    IERC20 public immutable xMETRIC;

    uint32 public proposalCount;

    uint256 public MinimumSubmissionBalance;
    uint64 public MaximumVotingDuration;

    uint8 public QorumPercentage;

    mapping(uint32 => Proposal) public Proposals;
    mapping(uint32 => mapping(address => Vote)) public Votes;

    constructor(
        IERC20 xmetric,
        uint256 minimumSubmissionBalance,
        uint64 maximumVotingDuration,
        uint8 quorumPercentage
    ) {
        require(quorumPercentage >= 1 && quorumPercentage <= 100);

        xMETRIC = xmetric;
        MinimumSubmissionBalance = minimumSubmissionBalance;
        MaximumVotingDuration = maximumVotingDuration;
        QorumPercentage = quorumPercentage;
    }

    modifier requireBalance(uint256 requiredBalance) {
        uint256 actualBalance = xMETRIC.balanceOf(msg.sender);

        if (actualBalance < requiredBalance) {
            revert InsufficientBalance(requiredBalance, actualBalance);
        }
        _;
    }

    function getProposalVotes(uint32 proposalId, VoteType voteType)
        external
        view
        returns (uint256)
    {
        return Proposals[proposalId].voteCounts[voteType];
    }

    function submitProposal(bytes32 contentHash)
        external
        requireBalance(MinimumSubmissionBalance)
        returns (uint32)
    {
        proposalCount += 1;

        Proposals[proposalCount].contentHash = contentHash;
        Proposals[proposalCount].submitter = msg.sender;
        Proposals[proposalCount].deadline =
            uint64(block.timestamp) +
            MaximumVotingDuration;
        Proposals[proposalCount].status = ProposalStatus.None;

        emit ProposalSubmitted(proposalCount);
        return proposalCount;
    }

    function submitVote(uint32 proposalId, VoteType voteType)
        external
        requireBalance(1)
    {
        if (voteType == VoteType.None) {
            revert InvalidVoteType();
        }
        if (block.timestamp > Proposals[proposalId].deadline) {
            revert VotingEnded(Proposals[proposalId].deadline, block.timestamp);
        }
        if (proposalId == 0 || proposalId > proposalCount) {
            revert InvalidProposalId(proposalId);
        }

        Vote memory previousVote = Votes[proposalId][msg.sender];
        uint256 currentBalance = xMETRIC.balanceOf(msg.sender);

        if (
            previousVote.voteType == voteType &&
            currentBalance == previousVote.amount
        ) {
            revert AlreadyVotedFor(voteType, currentBalance);
        }

        Proposals[proposalId].voteCounts[voteType] += currentBalance;
        Proposals[proposalId].voteCounts[previousVote.voteType] -= previousVote
            .amount;

        Votes[proposalId][msg.sender] = Vote({
            voteType: voteType,
            amount: currentBalance
        });

        uint256 minimumVotes = (xMETRIC.totalSupply() * QorumPercentage) / 100;
        uint256 yesVotes = Proposals[proposalId].voteCounts[VoteType.Yes];
        uint256 noVotes = Proposals[proposalId].voteCounts[VoteType.No];

        if ((yesVotes + noVotes) >= minimumVotes) {
            if (yesVotes > noVotes) {
                Proposals[proposalId].status = ProposalStatus.Accepted;
            } else {
                Proposals[proposalId].status = ProposalStatus.Rejected;
            }
        } else {
            Proposals[proposalId].status = ProposalStatus.None;
        }

        if (previousVote.voteType == VoteType.None) {
            emit VoteSubmitted(
                proposalId,
                msg.sender,
                voteType,
                currentBalance
            );
        } else {
            emit VoteUpdated(
                proposalId,
                msg.sender,
                previousVote.voteType,
                voteType,
                previousVote.amount,
                currentBalance
            );
        }
    }
}
