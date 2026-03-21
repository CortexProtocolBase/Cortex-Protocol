// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/Staking.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract StakingTest is Test {
    Staking staking;
    MockToken cortex;
    MockToken weth;

    address admin = address(1);
    address user = address(2);
    address rewarder = address(3);

    function setUp() public {
        cortex = new MockToken("Cortex", "CORTEX");
        weth = new MockToken("Wrapped ETH", "WETH");
        staking = new Staking(address(cortex), address(weth), admin);

        cortex.mint(user, 100_000 ether);
        vm.prank(user);
        cortex.approve(address(staking), type(uint256).max);

        weth.mint(rewarder, 100 ether);
        vm.prank(rewarder);
        weth.approve(address(staking), type(uint256).max);
    }

    function test_stakeNoLock() public {
        vm.prank(user);
        staking.stake(10_000 ether, 0);

        (uint256 amount, , uint256 multiplier, uint256 effective, ) = staking.getPosition(user);
        assertEq(amount, 10_000 ether);
        assertEq(multiplier, 10); // 1.0x
        assertEq(effective, 10_000 ether);
    }

    function test_stake90Days() public {
        vm.prank(user);
        staking.stake(10_000 ether, 90);

        (uint256 amount, , uint256 multiplier, uint256 effective, ) = staking.getPosition(user);
        assertEq(amount, 10_000 ether);
        assertEq(multiplier, 20); // 2.0x
        assertEq(effective, 20_000 ether);
    }

    function test_invalidLockDuration() public {
        vm.prank(user);
        vm.expectRevert("Invalid lock duration");
        staking.stake(10_000 ether, 45);
    }

    function test_unstakeAfterLock() public {
        vm.prank(user);
        staking.stake(10_000 ether, 30);

        // Cannot unstake before lock expires
        vm.prank(user);
        vm.expectRevert("Lock not expired");
        staking.unstake();

        // Warp past lock
        vm.warp(block.timestamp + 31 days);
        vm.prank(user);
        staking.unstake();

        assertEq(cortex.balanceOf(user), 100_000 ether);
    }

    function test_rewardDistribution() public {
        vm.prank(user);
        staking.stake(10_000 ether, 0);

        // Deposit rewards
        vm.prank(rewarder);
        staking.depositRewards(1 ether);

        uint256 pending = staking.pendingRewards(user);
        assertEq(pending, 1 ether);

        vm.prank(user);
        staking.claimRewards();
        assertEq(weth.balanceOf(user), 1 ether);
    }

    function test_cannotStakeZero() public {
        vm.prank(user);
        vm.expectRevert("Cannot stake zero");
        staking.stake(0, 0);
    }
}
