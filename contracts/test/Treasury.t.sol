// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Treasury.sol";
import "../src/Staking.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract TreasuryTest is Test {
    Treasury treasury;
    Staking staking;
    MockToken cortex;
    MockToken weth;

    address admin = address(1);
    address staker = address(2);

    function setUp() public {
        cortex = new MockToken("Cortex", "CORTEX");
        weth = new MockToken("Wrapped ETH", "WETH");
        staking = new Staking(address(cortex), address(weth), admin);
        treasury = new Treasury(admin, address(staking));

        // Set up a staker so depositRewards works
        cortex.mint(staker, 10_000 ether);
        vm.prank(staker);
        cortex.approve(address(staking), type(uint256).max);
        vm.prank(staker);
        staking.stake(10_000 ether, 0);
    }

    function test_distributeFees() public {
        // Send WETH to treasury
        weth.mint(address(treasury), 10 ether);

        treasury.distributeFees(address(weth));

        // 50% to staking (5 ether), 50% stays in treasury (5 ether)
        assertEq(weth.balanceOf(address(staking)), 5 ether);
        assertEq(weth.balanceOf(address(treasury)), 5 ether);
    }

    function test_withdraw() public {
        weth.mint(address(treasury), 10 ether);

        vm.prank(admin);
        treasury.withdraw(address(weth), 5 ether, admin);
        assertEq(weth.balanceOf(admin), 5 ether);
    }

    function test_onlyOwnerCanWithdraw() public {
        weth.mint(address(treasury), 10 ether);

        vm.prank(address(99));
        vm.expectRevert();
        treasury.withdraw(address(weth), 5 ether, address(99));
    }

    function test_noFeesToDistribute() public {
        vm.expectRevert("No fees to distribute");
        treasury.distributeFees(address(weth));
    }
}
