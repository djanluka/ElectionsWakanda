// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WKND is ERC20{
    
    constructor(uint amount) ERC20("WakandasToken", "WKND") {
        _mint(msg.sender, amount);
    }
    
    function balance(address a) view external returns(uint) {
        return balanceOf(a);
    }
    
    function transferToVoter(address voter) payable external {
        _transfer(msg.sender, voter, 1);
    }
    
    function transferToOwner(address voter, uint amount) payable external {
        _transfer(voter, msg.sender, amount);
    }
    function transferBetweenVoters(address sender, address recipient, uint amount) payable external {
        _transfer(sender, recipient, amount);
    }
}