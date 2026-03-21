// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/CortexVault.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract CortexVaultTest is Test {
    CortexVault vault;
    MockUSDC usdc;

    address admin = address(1);
    address treasury = address(2);
    address aiAgent = address(3);
    address user = address(4);

    function setUp() public {
        usdc = new MockUSDC();
        vault = new CortexVault(IERC20(address(usdc)), admin, treasury, aiAgent);

        // Fund user
        usdc.mint(user, 100_000e6);
        vm.prank(user);
        usdc.approve(address(vault), type(uint256).max);
    }

    function test_deposit() public {
        vm.prank(user);
        uint256 shares = vault.deposit(10_000e6, user);
        assertGt(shares, 0);
        assertEq(vault.balanceOf(user), shares);
        assertEq(vault.totalAssets(), 10_000e6);
    }

    function test_redeem() public {
        vm.prank(user);
        uint256 shares = vault.deposit(10_000e6, user);

        vm.prank(user);
        uint256 assets = vault.redeem(shares, user, user);

        // After 0.5% withdrawal fee, should get ~9950
        assertGt(assets, 9_900e6);
        assertLt(assets, 10_000e6);
    }

    function test_onlyAiCanExecuteStrategy() public {
        vm.prank(user);
        vm.expectRevert();
        vault.executeStrategy(address(usdc), "");
    }

    function test_pauseBlocking() public {
        vm.prank(admin);
        vault.pause();

        vm.prank(user);
        vm.expectRevert();
        vault.deposit(1000e6, user);
    }

    function test_nameAndSymbol() public view {
        assertEq(vault.name(), "Cortex Vault");
        assertEq(vault.symbol(), "cVLT");
    }

    function test_feeConfiguration() public view {
        assertEq(vault.withdrawalFeeBps(), 50);
        assertEq(vault.managementFeeBps(), 200);
        assertEq(vault.performanceFeeBps(), 2000);
    }

    function test_adminCanUpdateFees() public {
        vm.prank(admin);
        vault.setWithdrawalFee(100); // 1%
        assertEq(vault.withdrawalFeeBps(), 100);
    }

    function test_cannotSetExcessiveFees() public {
        vm.prank(admin);
        vm.expectRevert("Fee too high");
        vault.setWithdrawalFee(300); // 3% > 2% max
    }
}
