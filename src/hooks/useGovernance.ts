"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACTS } from "@/lib/constants";
import { governorAbi } from "@/lib/abis/governor";
import { tokenAbi } from "@/lib/abis/token";

export function useCastVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // support: 0 = Against, 1 = For, 2 = Abstain
  const castVote = (proposalId: bigint, support: number) => {
    writeContract({
      address: CONTRACTS.GOVERNANCE,
      abi: governorAbi,
      functionName: "castVote",
      args: [proposalId, support],
    });
  };

  return { castVote, hash, isPending, isConfirming, isSuccess, error };
}

export function useDelegate() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const delegate = (delegatee: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.CORTEX_TOKEN,
      abi: tokenAbi,
      functionName: "delegate",
      args: [delegatee],
    });
  };

  return { delegate, hash, isPending, isConfirming, isSuccess, error };
}

export function useVotingPower(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.CORTEX_TOKEN,
    abi: tokenAbi,
    functionName: "getVotes",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}
