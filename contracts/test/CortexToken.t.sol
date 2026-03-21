// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/CortexToken.sol";

contract CortexTokenTest is Test {
    CortexToken token;
    address deployer = address(1);

    function setUp() public {
        token = new CortexToken(deployer);
    }

    function test_totalSupply() public view {
        assertEq(token.totalSupply(), 1_000_000_000 ether);
    }

    function test_deployerReceivesAllTokens() public view {
        assertEq(token.balanceOf(deployer), 1_000_000_000 ether);
    }

    function test_nameAndSymbol() public view {
        assertEq(token.name(), "Cortex");
        assertEq(token.symbol(), "CORTEX");
    }

    function test_transfer() public {
        vm.prank(deployer);
        token.transfer(address(2), 1000 ether);
        assertEq(token.balanceOf(address(2)), 1000 ether);
        assertEq(token.balanceOf(deployer), 1_000_000_000 ether - 1000 ether);
    }

    function test_delegation() public {
        vm.prank(deployer);
        token.delegate(deployer);
        assertEq(token.getVotes(deployer), 1_000_000_000 ether);
    }
}
