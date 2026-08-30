export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-mono text-zinc-500 tracking-wider uppercase animate-pulse">
        Loading MLForge Engine...
      </p>
    </div>
  );
}
