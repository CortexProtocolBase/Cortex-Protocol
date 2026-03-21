// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Staking
/// @notice Lock CORTEX tokens to earn protocol fee share with time-based multipliers.
contract Staking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken;  // CORTEX
    IERC20 public immutable rewardToken;   // WETH

    // ─── Lock tier multipliers (scaled by 10 for precision) ─────────
    // 0 days = 10 (1.0x), 30 days = 15 (1.5x), 90 days = 20 (2.0x), 180 days = 25 (2.5x)
    uint256 private constant MULTIPLIER_SCALE = 10;

    struct StakePosition {
        uint256 amount;
        uint256 lockDuration;    // in seconds
        uint256 multiplier;      // scaled by MULTIPLIER_SCALE (e.g., 20 = 2.0x)
        uint256 stakedAt;
        uint256 unlocksAt;
        uint256 rewardDebt;
    }

    mapping(address => StakePosition) public positions;

    uint256 public totalEffectiveStake;
    uint256 public accRewardPerShare;  // scaled by 1e18
    uint256 public totalRewardsDeposited;

    // ─── Events ─────────────────────────────────────────────────────
    event Staked(address indexed user, uint256 amount, uint256 lockDuration);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsDeposited(uint256 amount);

    constructor(address stakingToken_, address rewardToken_, address admin)
        Ownable(admin)
    {
        stakingToken = IERC20(stakingToken_);
        rewardToken = IERC20(rewardToken_);
    }

    // ─── Lock tier validation ───────────────────────────────────────

    function _getMultiplier(uint256 lockDays) internal pure returns (uint256) {
        if (lockDays == 0) return 10;    // 1.0x
        if (lockDays == 30) return 15;   // 1.5x
        if (lockDays == 90) return 20;   // 2.0x
        if (lockDays == 180) return 25;  // 2.5x
        revert("Invalid lock duration");
    }

    // ─── Stake ──────────────────────────────────────────────────────

    /// @notice Stake CORTEX tokens with a lock duration.
    /// @param amount Amount of CORTEX to stake.
    /// @param lockDays Lock duration in days (0, 30, 90, or 180).
    function stake(uint256 amount, uint256 lockDays) external nonReentrant {
        require(amount > 0, "Cannot stake zero");
        require(positions[msg.sender].amount == 0, "Already staked, unstake first");

        uint256 multiplier = _getMultiplier(lockDays);
        uint256 effectiveStake = (amount * multiplier) / MULTIPLIER_SCALE;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        positions[msg.sender] = StakePosition({
            amount: amount,
            lockDuration: lockDays * 1 days,
            multiplier: multiplier,
            stakedAt: block.timestamp,
            unlocksAt: block.timestamp + (lockDays * 1 days),
            rewardDebt: (effectiveStake * accRewardPerShare) / 1e18
        });

        totalEffectiveStake += effectiveStake;

        emit Staked(msg.sender, amount, lockDays * 1 days);
    }

    // ─── Unstake ────────────────────────────────────────────────────

    /// @notice Unstake CORTEX tokens after lock period expires.
    function unstake() external nonReentrant {
        StakePosition storage pos = positions[msg.sender];
        require(pos.amount > 0, "No stake found");
        require(block.timestamp >= pos.unlocksAt, "Lock not expired");

        // Claim pending rewards first
        _claimRewards(msg.sender);

        uint256 amount = pos.amount;
        uint256 effectiveStake = (amount * pos.multiplier) / MULTIPLIER_SCALE;
        totalEffectiveStake -= effectiveStake;

        delete positions[msg.sender];

        stakingToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    // ─── Claim Rewards ──────────────────────────────────────────────

    function claimRewards() external nonReentrant {
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        StakePosition storage pos = positions[user];
        if (pos.amount == 0) return;

        uint256 effectiveStake = (pos.amount * pos.multiplier) / MULTIPLIER_SCALE;
        uint256 pending = ((effectiveStake * accRewardPerShare) / 1e18) - pos.rewardDebt;

        if (pending > 0) {
            pos.rewardDebt = (effectiveStake * accRewardPerShare) / 1e18;
            rewardToken.safeTransfer(user, pending);
            emit RewardClaimed(user, pending);
        }
    }

    // ─── Deposit Rewards (called by Treasury) ───────────────────────

    /// @notice Deposit WETH rewards for distribution to stakers.
    function depositRewards(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot deposit zero");
        require(totalEffectiveStake > 0, "No stakers");

        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        accRewardPerShare += (amount * 1e18) / totalEffectiveStake;
        totalRewardsDeposited += amount;

        emit RewardsDeposited(amount);
    }

    // ─── View Functions ─────────────────────────────────────────────

    function pendingRewards(address user) external view returns (uint256) {
        StakePosition storage pos = positions[user];
        if (pos.amount == 0) return 0;

        uint256 effectiveStake = (pos.amount * pos.multiplier) / MULTIPLIER_SCALE;
        return ((effectiveStake * accRewardPerShare) / 1e18) - pos.rewardDebt;
    }

    function getPosition(address user) external view returns (
        uint256 amount,
        uint256 lockDuration,
        uint256 multiplier,
        uint256 effectiveStake,
        uint256 unlocksAt
    ) {
        StakePosition storage pos = positions[user];
        amount = pos.amount;
        lockDuration = pos.lockDuration;
        multiplier = pos.multiplier;
        effectiveStake = (pos.amount * pos.multiplier) / MULTIPLIER_SCALE;
        unlocksAt = pos.unlocksAt;
    }
}
