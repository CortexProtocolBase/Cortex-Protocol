// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/CortexToken.sol";
import "../src/CortexVault.sol";
import "../src/Staking.sol";
import "../src/CortexGovernor.sol";
import "../src/Treasury.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";

/// @notice Deploy all CORTEX protocol contracts to Base.
/// @dev Usage: forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast --verify
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address aiAgent = vm.envOr("AI_AGENT_ADDRESS", address(0));

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy CORTEX token (1B supply to deployer)
        CortexToken token = new CortexToken(deployer);

        // 2. Deploy Timelock (24h delay, deployer as initial proposer/executor)
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = deployer; // Will be replaced by Governor
        executors[0] = address(0); // Anyone can execute after timelock
        TimelockController timelock = new TimelockController(
            1 days,    // 24h delay
            proposers,
            executors,
            deployer   // admin (will renounce after setup)
        );

        // 3. Deploy Governor
        CortexGovernor governor = new CortexGovernor(token, timelock);

        // Grant Governor the proposer role on Timelock
        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.CANCELLER_ROLE(), address(governor));
        // Remove deployer as proposer (Governor is now the only proposer)
        timelock.revokeRole(timelock.PROPOSER_ROLE(), deployer);

        // 4. Deploy Staking (CORTEX staking, WETH rewards)
        // Note: On Base, WETH is at 0x4200000000000000000000000000000000000006
        address weth = 0x4200000000000000000000000000000000000006;
        Staking staking = new Staking(address(token), weth, deployer);

        // 5. Deploy Treasury
        Treasury treasury = new Treasury(deployer, address(staking));

        // 6. Deploy Vault (USDC as underlying asset)
        // Note: On Base, USDC is at 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
        address usdc = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        CortexVault vault = new CortexVault(
            IERC20(usdc),
            deployer,
            address(treasury),
            aiAgent
        );

        vm.stopBroadcast();

        // Log deployed addresses
        console.log("=== CORTEX Protocol Deployed ===");
        console.log("CortexToken:    ", address(token));
        console.log("CortexVault:    ", address(vault));
        console.log("Staking:        ", address(staking));
        console.log("CortexGovernor: ", address(governor));
        console.log("Timelock:       ", address(timelock));
        console.log("Treasury:       ", address(treasury));
        console.log("================================");
    }
}
