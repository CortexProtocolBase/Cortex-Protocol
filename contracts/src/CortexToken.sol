// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title CortexToken
/// @notice ERC-20 governance token with fixed 1B supply and ERC20Votes for on-chain governance.
contract CortexToken is ERC20, ERC20Permit, ERC20Votes {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 ether;

    constructor(address recipient) ERC20("Cortex", "CORTEX") ERC20Permit("Cortex") {
        _mint(recipient, TOTAL_SUPPLY);
    }

    // ─── Required overrides ─────────────────────────────────────────

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
