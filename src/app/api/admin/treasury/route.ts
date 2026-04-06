import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CONTRACTS } from "@/lib/constants";
import { ERC20_ABI } from "@/lib/dex/abis/erc20";
import { BASE_TOKENS } from "@/lib/dex/constants";
export const dynamic = "force-dynamic";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const tokens = [{ symbol: "WETH", address: BASE_TOKENS.WETH, decimals: 18 }, { symbol: "USDC", address: BASE_TOKENS.USDC, decimals: 6 }];
    const balances = await Promise.all(tokens.map(async (token) => {
      const balance = await client.readContract({ address: token.address as `0x${string}`, abi: ERC20_ABI, functionName: "balanceOf", args: [CONTRACTS.TREASURY as `0x${string}`] });
      return { asset: token.symbol, balance: Number(balance as bigint) / Math.pow(10, token.decimals) };
    }));
    return NextResponse.json({ data: { balances, treasury: CONTRACTS.TREASURY } });
  } catch (err) { console.error("[admin/treasury]", err); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
