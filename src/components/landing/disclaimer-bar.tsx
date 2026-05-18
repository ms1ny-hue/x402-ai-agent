export function DisclaimerBar() {
  return (
    <div className="bg-[#0a0e1a] text-[#fbfaf7] text-[12px] leading-relaxed font-mono">
      <div className="max-w-6xl mx-auto px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-1 justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b1a] animate-pulse" />
          <span>
            Real x402 protocol · real on-chain settlement · Base Sepolia
            testnet · no real money moves
          </span>
        </div>
        <div className="text-[#fbfaf7]/55">
          Portfolio prototype. Synthetic research content. Not investment
          advice.
        </div>
      </div>
    </div>
  );
}
