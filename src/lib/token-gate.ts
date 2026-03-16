import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";
import { CONTRACTS, TOKEN_GATE_MIN_BALANCE } from "./constants";

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL),
});

const erc20Abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
]);

/**
 * Check if a wallet holds enough CORTEX tokens to access gated endpoints.
 * Returns true if balance >= TOKEN_GATE_MIN_BALANCE.
 */
export async function hasTokenAccess(walletAddress: string): Promise<boolean> {
  try {
    const balance = await publicClient.readContract({
      address: CONTRACTS.CORTEX_TOKEN,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [walletAddress as `0x${string}`],
    });
    return balance >= TOKEN_GATE_MIN_BALANCE;
  } catch {
    return false;
  }
}

/**
 * Extract wallet address from request headers.
 * Returns null if header is missing or invalid.
 */
export function getWalletFromHeaders(headers: Headers): string | null {
  const address = headers.get("x-wallet-address");
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) return null;
  return address;
}
