// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;

import "./Ballot.sol";

contract BallotFactory {
  address[] public deployedBallots;
  
  event deployedContract(address _address);
  
  function createNewBallot(string memory _details) public {
    //Deploy a new ballot
    Ballot newBallot = new Ballot(_details, msg.sender);
    //Get the address
    address ballotAddress = address(newBallot);
    deployedBallots.push(ballotAddress);
    emit deployedContract(ballotAddress);
  }

  function getBallots() public view returns(address[] memory) {
      return deployedBallots;
  }
}
