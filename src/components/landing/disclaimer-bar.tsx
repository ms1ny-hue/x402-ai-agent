export function DisclaimerBar() {
  return (
    <div className="bg-black text-[var(--x-text-muted)] text-[10.5px] leading-tight font-mono border-b border-[var(--x-border-bright)] relative z-20">
      <div className="max-w-7xl mx-auto px-5 py-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 justify-between">
        <div className="flex items-center gap-2 uppercase tracking-[0.22em]">
          <span className="text-[var(--x-signal)]">⚠</span>
          <span>
            portfolio prototype · synthetic data · not regulated · no real funds
          </span>
        </div>
        <div className="text-[var(--x-text-subtle)] tracking-[0.18em] uppercase">
          classification · public demo · revision 0.5
        </div>
      </div>
    </div>
  );
}
