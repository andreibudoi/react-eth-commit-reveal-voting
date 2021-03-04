// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;



/// @title Commit Reveal Voting Scheme
/// @author Andrei Budoi
/// @notice Votes must be encrypted using keccak256
/// @dev Should try to change most strings into bytes32 sometime
contract Poll {
  
    struct Voter {
        string name;   // can represent name or id 
        bool voted;  // if true, that person already voted
    }

    // State of a vote
    // Committed -> After sending a hashed vote during the "Voting" state of the poll
    // Revealed -> After sending the hashed vote together with correct decrypted vote during the "Revealing" state of the poll
    enum VoteState { Committed, Revealed }

    struct Vote{
        address voterAddress; // who voted
        VoteState voteState; // Committed or Revealed
    }

    // This is a type for a single proposal (choice).
    struct Choice {
        string name;   // short name (up to 32 chars)
        uint32 voteCount; // number of accumulated votes (max 4294967296 votes per proposal)
    }


    mapping(bytes32 => Vote) votes; // Either `Committed` or `Revealed`; indexed by hashed choice
    mapping(address => Voter) voters; // Registered voters are indexed by their wallet address

    // A dynamically-sized array of `Choice` structs.
    Choice[] public choices;

    // uint32 -> max 4294967296 voters/votes
    uint32 public totalVoters = 0;
    uint32 public totalVotes = 0;
    address payable public pollOwner;
    string public pollDetails;

    //State of the Poll Contract
    //Created -> Proposals and voters are added
    //Voting -> Every registered voter commits a hashed vote with the format "[index of proposal]-[password]" 
    //      passwords must be hashed using Keccak-256
    //      example: "2-yogurt" -> "0xedf92158c3f1170092fb3b3f15ff96adf2ee73ea0c92d07d2dfc84612938abf9")
    //Revealing -> Voting has ended and everybody has to submit their passwords so that the votes can be counted
    //Ended -> Final results become available
    enum PollState { Created, Voting, Revealing, Ended }

	PollState public pollState;


    /** EVENTS */

    // Events used to log what's going on in the contract
    event voterAdded(address voter, string name);
    event choiceAdded(string name);
    event choiceName(string name);
    event votingStarted(bytes32 pollInfo);
    event voteCommitted(bytes32 voteInfo, bytes32 pass);
    event votesCanBeRevealed(bytes32 pollInfo);
    event voteRevealed(bytes32 voteInfo, uint8 vote, bytes32 name);
    event votingEnded(string name, uint32 result);
    

    /** FUNCTIONS */

    /// @notice Setup the owner of the contract and its description
    constructor(string memory _pollDetails, address payable _owner){
        pollOwner = _owner;
        pollDetails = _pollDetails;
        pollState = PollState.Created;
    }
    
    modifier onlyPollOwner() {
		require(msg.sender == pollOwner);
		_;
	}

    modifier onlyWhenStateIs(PollState _state) {
		require(pollState == _state);
		_;
	}

    /// @notice Register a voter. Must have a name or id and it shouldn't be already registered.
    /// @dev Maybe change function to accept array of voters?
    /// @param voterAddress_ The voter's wallet address
    /// @param voterName_ The voter's name or id
    function addVoter(address voterAddress_, string memory voterName_)
        public
        onlyPollOwner
        onlyWhenStateIs(PollState.Created)
    {
        require(bytes(voterName_).length != 0, "Enter a name!");
        require(bytes(voters[voterAddress_].name).length == 0 , "Voter already registered!");

        Voter memory voter;
        voter.name = voterName_;
        voter.voted = false;    
        voters[voterAddress_] = voter; // Add registered voter to mapping

        totalVoters++;

        emit voterAdded(voterAddress_, voterName_);
    }

    /// @notice Add a new choice to vote for
    /// @dev Maybe change function to accept array of choices?
    /// @param _choiceName Name or description of proposal.
    function addChoice(string memory _choiceName)
        public
        onlyPollOwner
        onlyWhenStateIs(PollState.Created)
    {
        choices.push(Choice({
            name: _choiceName,
            voteCount: 0
        }));
        emit choiceAdded(_choiceName);
    }
    
    /// @notice Show the list of choices
    function showChoices () public {
        for (uint8 i = 0; i < choices.length; i++) {
            emit choiceName(choices[i].name);
        }
    }

    /// @notice Start the vote
    function startVote()
        public
        onlyPollOwner
        onlyWhenStateIs(PollState.Created)
    {
        pollState = PollState.Voting;     
        emit votingStarted("Voting has started");
    }

    /// @param _voteCommit Encrypted vote with the format "[No. of choice]-[password]" 
    /// @notice !!!! The array of choices is indexed from 0   
    /// @notice !!!! Votes must be encrypted using Keccak-256
    /// @notice https://emn178.github.io/online-tools/keccak_256.html
    /// @notice Example: "2-yogurt" (picked third option with "yogurt" as a password) will be encrypted and sent as 
    /// @notice "0xedf92158c3f1170092fb3b3f15ff96adf2ee73ea0c92d07d2dfc84612938abf9"
    /// @notice !!!! No two hashes can be the same in a poll. A hash must be unique
    function commitVote(bytes32 _voteCommit)
        public
        onlyWhenStateIs(PollState.Voting)
    {
        Voter storage sender = voters[msg.sender];
        
        require(bytes(sender.name).length != 0 , "Address not registered");
        require(!sender.voted, "Already voted.");
        require(votes[_voteCommit].voterAddress == address(0x0), "There already exists a vote with this hash");

        Vote memory vote;
        // Create vote
        vote.voterAddress = msg.sender;
        vote.voteState = VoteState.Committed;

        // Add the committed vote
        votes[_voteCommit] = vote;

        // Flag voter
        sender.voted = true;
    
        totalVotes ++;
        voteCommitted("Vote committed with hash ", _voteCommit);
    }

    /// @notice Start revealing votes
    function startReveal()
        public
        onlyPollOwner
        onlyWhenStateIs(PollState.Voting)
    {
        pollState = PollState.Revealing;     
        emit votesCanBeRevealed("Please reveal your votes now");
    }

    /// @notice Reveal your vote. 
    /// @param _choiceNumber Index of your picked choice. Must match with _vote's [No. of choice]
    /// @param _vote Your decrypted vote with the format "[No. of choice]-[password]". Must match _voteCommit if encrypted with keccak256.
    /// @param _voteCommit Your encrypted vote committed during "Voting" state.
    function revealVote(string memory _choiceNumber, string memory _vote, bytes32 _voteCommit) 
        public
        onlyWhenStateIs(PollState.Revealing)
    {
        require(votes[_voteCommit].voterAddress == msg.sender, "This vote doesn't exist or isn't yours");
        require(votes[_voteCommit].voteState == VoteState.Committed, "This vote was already revealed");
        require(keccak256(abi.encodePacked(_vote)) == _voteCommit, "Your vote doesn't match your hash");

        // Check first bytes of _choiceNumber and _vote to see if they match
        bytes memory bytesChoiceNumber = bytes(_choiceNumber);
        bytes memory bytesVote = bytes(_vote);
        
        for (uint8 i = 0; i < bytesChoiceNumber.length; i++) {
            require(bytesChoiceNumber[i] == bytesVote[i], "Your choice number doesn't match your vote");
        }
        
        // Convert _choiceNumber to uint
        uint8 uintChoiceNumber = uint8(stringToUint(_choiceNumber));

        // Increase vote count for the option chosen
        choices[uintChoiceNumber].voteCount += 1;

        //Change state of vote
        votes[_voteCommit].voteState == VoteState.Revealed;
    }
    
    /// @notice Ends the vote. Committed votes cannot be revealed anymore
    /// @dev Should add a way to check for ties and handle them accordingly.
    /// @return winnerName Winner's name and vote count
    function endVote() 
        public
        onlyPollOwner
        onlyWhenStateIs(PollState.Revealing)
        returns (string memory winnerName, uint32 winnerVoteCount)
    {
        uint winningVoteCount = 0;
        uint winnerIndex = 0;

        for (uint i = 0; i < choices.length; i++) {
            if (choices[i].voteCount > winningVoteCount) {
                winningVoteCount = choices[i].voteCount;
                winnerIndex = i;
            }
        }

        winnerName = choices[winnerIndex].name;
        pollState = PollState.Ended;     
        emit votingEnded(winnerName, uint32(winningVoteCount));
        return (winnerName, uint32(winningVoteCount));
    }

    /// @notice Function that converts string to uint
    /// @param s Value to parse
    /// @return result An unsigned integer parsed from given string. Returns 0 if numbers are not found.
    function stringToUint(string memory s) internal pure returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint8 c = uint8(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }
}