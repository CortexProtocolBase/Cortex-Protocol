import { createPublicClient, http, webSocket, parseAbi } from "viem";
import { base } from "viem/chains";

const httpClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

function getWsClient() {
  const wssUrl = process.env.BASE_WSS_URL;
  if (!wssUrl) return null;
  return createPublicClient({
    chain: base,
    transport: webSocket(wssUrl),
  });
}

// ─── ABIs for CORTEX contracts ───────────────────────────────────────

const vaultAbi = parseAbi([
  "event Deposit(address indexed user, uint256 amount, uint256 shares)",
  "event Withdraw(address indexed user, uint256 amount, uint256 shares)",
]);

const stakingAbi = parseAbi([
  "event Staked(address indexed user, uint256 amount, uint256 lockDuration)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount)",
]);

const governanceAbi = parseAbi([
  "event ProposalCreated(uint256 indexed proposalId, address proposer, string description)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
]);

// ─── Event Watchers ──────────────────────────────────────────────────

export function watchVaultEvents(
  vaultAddress: `0x${string}`,
  onDeposit: (user: string, amount: bigint, shares: bigint) => void,
  onWithdraw: (user: string, amount: bigint, shares: bigint) => void
) {
  const client = getWsClient() ?? httpClient;
  return client.watchContractEvent({
    address: vaultAddress,
    abi: vaultAbi,
    eventName: "Deposit",
    onLogs: (logs) => {
      for (const log of logs) {
        const { user, amount, shares } = log.args as {
          user: string;
          amount: bigint;
          shares: bigint;
        };
        onDeposit(user, amount, shares);
      }
    },
  });
}

export function watchStakingEvents(
  stakingAddress: `0x${string}`,
  onStaked: (user: string, amount: bigint) => void,
  onUnstaked: (user: string, amount: bigint) => void
) {
  const client = getWsClient() ?? httpClient;
  return client.watchContractEvent({
    address: stakingAddress,
    abi: stakingAbi,
    eventName: "Staked",
    onLogs: (logs) => {
      for (const log of logs) {
        const { user, amount } = log.args as { user: string; amount: bigint };
        onStaked(user, amount);
      }
    },
  });
}

export function watchGovernanceEvents(
  governanceAddress: `0x${string}`,
  onProposal: (proposalId: bigint, proposer: string) => void,
  onVote: (proposalId: bigint, voter: string, support: boolean) => void
) {
  const client = getWsClient() ?? httpClient;
  return client.watchContractEvent({
    address: governanceAddress,
    abi: governanceAbi,
    eventName: "ProposalCreated",
    onLogs: (logs) => {
      for (const log of logs) {
        const { proposalId, proposer } = log.args as {
          proposalId: bigint;
          proposer: string;
        };
        onProposal(proposalId, proposer);
      }
    },
  });
}

export { httpClient };
