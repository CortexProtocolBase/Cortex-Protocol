"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits } from "viem";
import { CONTRACTS } from "@/lib/constants";
import { stakingAbi } from "@/lib/abis/staking";
import { tokenAbi } from "@/lib/abis/token";

export function useApproveForStaking() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (amount: string) => {
    writeContract({
      address: CONTRACTS.CORTEX_TOKEN,
      abi: tokenAbi,
      functionName: "approve",
      args: [CONTRACTS.STAKING, parseUnits(amount, 18)],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

export function useStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: string, lockDays: number) => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: stakingAbi,
      functionName: "stake",
      args: [parseUnits(amount, 18), BigInt(lockDays)],
    });
  };

  return { stake, hash, isPending, isConfirming, isSuccess, error };
}

export function useUnstake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unstake = () => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: stakingAbi,
      functionName: "unstake",
    });
  };

  return { unstake, hash, isPending, isConfirming, isSuccess, error };
}

export function useClaimRewards() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimRewards = () => {
    writeContract({
      address: CONTRACTS.STAKING,
      abi: stakingAbi,
      functionName: "claimRewards",
    });
  };

  return { claimRewards, hash, isPending, isConfirming, isSuccess, error };
}

export function useStakingPosition(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.STAKING,
    abi: stakingAbi,
    functionName: "getPosition",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function usePendingRewards(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.STAKING,
    abi: stakingAbi,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useCortexBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.CORTEX_TOKEN,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}
