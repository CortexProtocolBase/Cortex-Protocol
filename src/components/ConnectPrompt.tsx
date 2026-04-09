import { Wallet } from "lucide-react";
export default function ConnectPrompt({ message = "Connect your wallet to continue" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-card-solid flex items-center justify-center mb-4"><Wallet className="w-6 h-6 text-muted" /></div>
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}
