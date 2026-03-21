// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Treasury
/// @notice Collects protocol fees and distributes 50% to stakers, 50% to treasury reserve.
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public stakingContract;
    uint256 public stakerShareBps = 5000;  // 50%
    uint256 public constant FEE_DENOMINATOR = 10000;

    event FeesDistributed(address indexed token, uint256 toStakers, uint256 toTreasury);
    event StakingContractUpdated(address indexed newStaking);
    event StakerShareUpdated(uint256 newShareBps);
    event Withdrawn(address indexed token, uint256 amount, address indexed to);

    constructor(address admin, address stakingContract_) Ownable(admin) {
        stakingContract = stakingContract_;
    }

    // ─── Distribute Fees ────────────────────────────────────────────

    /// @notice Distribute a token's balance: stakerShareBps to staking, rest stays in treasury.
    /// @param token The ERC-20 token to distribute (e.g., WETH).
    function distributeFees(address token) external nonReentrant {
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No fees to distribute");

        uint256 toStakers = (balance * stakerShareBps) / FEE_DENOMINATOR;
        uint256 toTreasury = balance - toStakers;

        if (toStakers > 0 && stakingContract != address(0)) {
            IERC20(token).forceApprove(stakingContract, toStakers);
            // Call depositRewards on the Staking contract
            (bool success,) = stakingContract.call(
                abi.encodeWithSignature("depositRewards(uint256)", toStakers)
            );
            require(success, "Reward deposit failed");
        }

        emit FeesDistributed(token, toStakers, toTreasury);
    }

    // ─── Admin Functions ────────────────────────────────────────────

    /// @notice Withdraw tokens from treasury reserve (governance controlled).
    function withdraw(address token, uint256 amount, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
        emit Withdrawn(token, amount, to);
    }

    function setStakingContract(address newStaking) external onlyOwner {
        stakingContract = newStaking;
        emit StakingContractUpdated(newStaking);
    }

    function setStakerShare(uint256 newShareBps) external onlyOwner {
        require(newShareBps <= FEE_DENOMINATOR, "Invalid share");
        stakerShareBps = newShareBps;
        emit StakerShareUpdated(newShareBps);
    }

    /// @notice Accept ETH sent to the treasury.
    receive() external payable {}
}
