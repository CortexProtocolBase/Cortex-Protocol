interface AllocationBarProps { core: number; mid: number; degen: number; height?: string; }

export default function AllocationBar({ core, mid, degen, height = "h-3" }: AllocationBarProps) {
  return (
    <div className={`w-full ${height} rounded-full overflow-hidden flex`}>
      <div className="bg-[#3B82F6] h-full transition-all duration-500" style={{ width: `${core}%` }} />
      <div className="bg-[#60A5FA] h-full transition-all duration-500" style={{ width: `${mid}%` }} />
      <div className="bg-[#93C5FD] h-full transition-all duration-500" style={{ width: `${degen}%` }} />
    </div>
  );
}
