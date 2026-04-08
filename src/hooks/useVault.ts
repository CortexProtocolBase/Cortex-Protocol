"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACTS } from "@/lib/constants";
import { vaultAbi } from "@/lib/abis/vault";
import { tokenAbi } from "@/lib/abis/token";

// USDC on Base (6 decimals)
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const USDC_DECIMALS = 6;

// Minimal ERC-20 ABI for approve + allowance
const erc20Abi = [
  {
    type: "function" as const,
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable" as const,
  },
  {
    type: "function" as const,
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
    stateMutability: "view" as const,
  },
  {
    type: "function" as const,
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "view" as const,
  },
] as const;

export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: string) => {
    writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [CONTRACTS.CVAULT, parseUnits(amount, USDC_DECIMALS)],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useUSDCAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "allowance",
    args: owner ? [owner, CONTRACTS.CVAULT] : undefined,
    query: { enabled: !!owner },
  });
}

export function useUSDCBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (amount: string, receiver: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "deposit",
      args: [parseUnits(amount, USDC_DECIMALS), receiver],
    });
  };

  return { deposit, hash, isPending, isConfirming, isSuccess, error };
}

export function useRedeem() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const redeem = (shares: string, receiver: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.CVAULT,
      abi: vaultAbi,
      functionName: "redeem",
      args: [parseUnits(shares, USDC_DECIMALS), receiver, receiver],
    });
  };

  return { redeem, hash, isPending, isConfirming, isSuccess, error };
}

export function useVaultShares(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.CVAULT,
    abi: vaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useVaultTotalAssets() {
  return useReadContract({
    address: CONTRACTS.CVAULT,
    abi: vaultAbi,
    functionName: "totalAssets",
  });
}
