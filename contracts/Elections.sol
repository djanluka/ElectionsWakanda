// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./WKND.sol";

contract Elections {
    
    //Six million residents have access to voting
    uint256 private totalSupply = 6000000;
    WKND private wknd;
    
    constructor ()  {
        wknd = new WKND(totalSupply);
    }
    
    //Voter must be registred
    mapping(address => bool) public registredVoters;
    //Voter can vote only once 
    mapping(address => bool) private voters;
    //Every candidate has id and number of votes
    mapping(uint => uint) private candidates;
    
    event newChallenger (
        uint indexed firstPlace,
        uint indexed secondPlace,
        uint indexed thirdPlace
    );
    
    function balance(address a) view public returns(uint){
        //Number of WKND tokens for voters
        return wknd.balance(a);
    }
    
    modifier hasEnoughWknd(uint amount) {
        require(amount > 0 && balance(msg.sender) >= amount, 'Dont have enough WKND tokens');
        _;
    }
    
    function register() external {
        require(!registredVoters[msg.sender], "Already registred voter");
        registredVoters[msg.sender] = true;
        
        wknd.transferToVoter(msg.sender);
    }
    
    function transferWKNDBetweenVoters(address to, uint amount) hasEnoughWknd(amount) external {
        wknd.transferBetweenVoters(msg.sender, to, amount);
    }
    
    function vote (uint candidateId, uint amount) hasEnoughWknd(amount) public {
        
        require(registredVoters[msg.sender], 'Voter must be registred');
        require(!voters[msg.sender], 'Voter has already voted');
        
        //VOTING
        candidates[candidateId] = candidates[candidateId] + amount;
        voters[msg.sender] = true;
        wknd.transferToOwner(msg.sender, amount);
        
        if (checkChallenger(candidateId)) {
            emit newChallenger(idFirstPlace, idSecondPlace, idThirdPlace);
        }
    }
    
    uint idFirstPlace;
    uint idSecondPlace;
    uint idThirdPlace;
    
    uint votesFirstPlace;
    uint votesSecondPlace;
    uint votesThirdPlace;
    
    function winningCandidates() view external returns(uint, uint, uint){
        return (idFirstPlace, idSecondPlace, idThirdPlace);
    }
    
    function checkChallenger(uint candidateId) private returns(bool){
        uint oldFirstPlace = idFirstPlace;
        uint oldSecondPlace = idSecondPlace;
        uint oldThirdPlace = idThirdPlace;
        
        uint voteCount = candidates[candidateId];
        updateResults(candidateId, voteCount);
        
        if (oldFirstPlace != idFirstPlace ||
            oldSecondPlace != idSecondPlace ||
            oldThirdPlace != idThirdPlace
        ) {
            return true;
        }
        
        return false;
    }
    
    function updateResults(uint candidateId, uint voteCount) private {
        if (voteCount > votesFirstPlace) {
            
            if (candidateId == idFirstPlace) {
                updatePlace(1, candidateId, voteCount);
            } else if (candidateId == idSecondPlace) {
                changeSecondPlace();
                updatePlace(1, candidateId, voteCount);
            } else {
                changeThirdPlace();
                changeSecondPlace();
                updatePlace(1, candidateId, voteCount);
            }
            
        } else if (voteCount > votesSecondPlace) {
            
            if (candidateId == idSecondPlace) {
                updatePlace(2, candidateId, voteCount);
            } else {
                changeThirdPlace();
                updatePlace(2, candidateId, voteCount);
            }
            
        } else if (voteCount > votesThirdPlace) {
            updatePlace(3, candidateId, voteCount);
        }
    }
    
    function changeThirdPlace() private {
        idThirdPlace = idSecondPlace;
        votesThirdPlace = votesSecondPlace;
    }
    
    function changeSecondPlace() private {
        idSecondPlace = idFirstPlace;
        votesSecondPlace = votesFirstPlace;
    }
    
    function updatePlace(uint pos, uint candidateId,uint voteCount) private {
        if (pos == 1) {
            idFirstPlace = candidateId;
            votesFirstPlace = voteCount;
        } else if (pos == 2) {
            idSecondPlace = candidateId;
            votesSecondPlace = voteCount;
        } else {
            idThirdPlace = candidateId;
            votesThirdPlace = voteCount;
        }    
    }
}