export function DisclaimerBar() {
  return (
    <div className="bg-black text-[var(--x-chrome-2)] text-[11px] leading-tight font-mono border-b border-[var(--x-border-bright)]">
      <div className="max-w-6xl mx-auto px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
          <span className="uppercase tracking-[0.18em] text-[10.5px]">
            x402 protocol · EIP-3009 · USDC · base-sepolia (eip155:84532)
          </span>
        </div>
        <div className="text-[var(--x-text-subtle)] text-[10.5px]">
          testnet · no real funds · synthetic research content
        </div>
      </div>
    </div>
  );
}
