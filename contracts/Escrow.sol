// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

//To-do add multiple arbiters required

contract Escrow {
	address public arbiter1;
	address public arbiter2;
	address public beneficiary;
	address public depositor;

	uint public approveCount = 0;

	constructor(address _arbiter1, address _arbiter2, address _beneficiary) payable {
		arbiter1 = _arbiter1;
		arbiter2 = _arbiter2;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Approved();
	event Sent(uint);

	function approve() external {
		require(msg.sender == arbiter1 || msg.sender == arbiter2);
		approveCount += 1;
		emit Approved();
		if (approveCount == 2) {
			uint balance = address(this).balance;
			(bool sent, ) = payable(beneficiary).call{value: balance}("");
 			require(sent, "Failed to send Ether");
			emit Sent(balance);
		}
	}
}