// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CortexVault
/// @notice ERC-4626 vault for the CORTEX protocol. Users deposit USDC, receive cVault shares.
///         An autonomous AI agent (AI_ROLE) can execute strategies on behalf of the vault.
contract CortexVault is ERC4626, AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Roles ──────────────────────────────────────────────────────
    bytes32 public constant AI_ROLE = keccak256("AI_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    // ─── Fee configuration (basis points, 10000 = 100%) ────────────
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public withdrawalFeeBps = 50;      // 0.5%
    uint256 public managementFeeBps = 200;     // 2%
    uint256 public performanceFeeBps = 2000;   // 20%

    // ─── Fee tracking ───────────────────────────────────────────────
    address public treasury;
    uint256 public lastFeeCollection;
    uint256 public highWaterMark;

    // ─── Events ─────────────────────────────────────────────────────
    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);
    event StrategyExecuted(address indexed agent, bytes data);
    event FeesCollected(uint256 managementFee, uint256 performanceFee);
    event TreasuryUpdated(address indexed newTreasury);
    event WithdrawalFeeUpdated(uint256 newFeeBps);
    event ManagementFeeUpdated(uint256 newFeeBps);
    event PerformanceFeeUpdated(uint256 newFeeBps);

    constructor(
        IERC20 asset_,
        address admin,
        address treasury_,
        address aiAgent
    )
        ERC4626(asset_)
        ERC20("Cortex Vault", "cVLT")
    {
        require(treasury_ != address(0), "Treasury cannot be zero");

        treasury = treasury_;
        lastFeeCollection = block.timestamp;
        highWaterMark = 1e18; // 1:1 initial share price

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GUARDIAN_ROLE, admin);
        if (aiAgent != address(0)) {
            _grantRole(AI_ROLE, aiAgent);
        }
    }

    // ─── Deposit override (emit custom event) ───────────────────────

    function deposit(uint256 assets, address receiver)
        public
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        uint256 shares = super.deposit(assets, receiver);
        emit Deposit(receiver, assets, shares);
        return shares;
    }

    // ─── Mint override ──────────────────────────────────────────────

    function mint(uint256 shares, address receiver)
        public
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        return super.mint(shares, receiver);
    }

    // ─── Withdraw override (apply withdrawal fee) ───────────────────

    function withdraw(uint256 assets, address receiver, address owner_)
        public
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        uint256 fee = (assets * withdrawalFeeBps) / FEE_DENOMINATOR;
        uint256 assetsAfterFee = assets - fee;

        uint256 shares = super.withdraw(assetsAfterFee, receiver, owner_);

        if (fee > 0) {
            SafeERC20.safeTransfer(IERC20(asset()), treasury, fee);
        }

        emit Withdraw(receiver, assets, shares);
        return shares;
    }

    // ─── Redeem override (apply withdrawal fee) ─────────────────────

    function redeem(uint256 shares, address receiver, address owner_)
        public
        override
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        // Redeem to this contract first so we can deduct the fee
        uint256 assets = super.redeem(shares, address(this), owner_);
        uint256 fee = (assets * withdrawalFeeBps) / FEE_DENOMINATOR;
        uint256 assetsAfterFee = assets - fee;

        if (fee > 0) {
            SafeERC20.safeTransfer(IERC20(asset()), treasury, fee);
        }
        SafeERC20.safeTransfer(IERC20(asset()), receiver, assetsAfterFee);

        emit Withdraw(receiver, assetsAfterFee, shares);
        return assetsAfterFee;
    }

    // ─── AI Strategy Execution ──────────────────────────────────────

    /// @notice Execute a strategy on behalf of the vault. Restricted to AI_ROLE.
    /// @param target The contract to call (e.g., a DEX router).
    /// @param data The calldata for the external call.
    function executeStrategy(address target, bytes calldata data)
        external
        onlyRole(AI_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(target != address(0), "Invalid target");
        require(target != address(this), "Cannot self-call");

        (bool success, ) = target.call(data);
        require(success, "Strategy execution failed");

        emit StrategyExecuted(msg.sender, data);
    }

    // ─── Fee Collection ─────────────────────────────────────────────

    /// @notice Collect management and performance fees. Callable by anyone.
    function collectFees() external nonReentrant {
        uint256 totalAssets_ = totalAssets();
        if (totalAssets_ == 0) return;

        // Management fee (prorated since last collection)
        uint256 elapsed = block.timestamp - lastFeeCollection;
        uint256 managementFee = (totalAssets_ * managementFeeBps * elapsed) / (FEE_DENOMINATOR * 365 days);

        // Performance fee (on profit above high-water mark)
        uint256 currentSharePrice = (totalAssets_ * 1e18) / totalSupply();
        uint256 performanceFee = 0;
        if (currentSharePrice > highWaterMark) {
            uint256 profit = ((currentSharePrice - highWaterMark) * totalSupply()) / 1e18;
            performanceFee = (profit * performanceFeeBps) / FEE_DENOMINATOR;
            highWaterMark = currentSharePrice;
        }

        uint256 totalFee = managementFee + performanceFee;
        if (totalFee > 0 && totalFee <= totalAssets_) {
            // Mint fee shares to treasury
            uint256 feeShares = convertToShares(totalFee);
            if (feeShares > 0) {
                _mint(treasury, feeShares);
            }
        }

        lastFeeCollection = block.timestamp;
        emit FeesCollected(managementFee, performanceFee);
    }

    // ─── Admin Functions ────────────────────────────────────────────

    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Treasury cannot be zero");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setWithdrawalFee(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 200, "Fee too high"); // max 2%
        withdrawalFeeBps = newFeeBps;
        emit WithdrawalFeeUpdated(newFeeBps);
    }

    function setManagementFee(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 500, "Fee too high"); // max 5%
        managementFeeBps = newFeeBps;
        emit ManagementFeeUpdated(newFeeBps);
    }

    function setPerformanceFee(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 3000, "Fee too high"); // max 30%
        performanceFeeBps = newFeeBps;
        emit PerformanceFeeUpdated(newFeeBps);
    }

    // ─── Emergency Controls ─────────────────────────────────────────

    function pause() external onlyRole(GUARDIAN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ─── Required overrides ─────────────────────────────────────────

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
