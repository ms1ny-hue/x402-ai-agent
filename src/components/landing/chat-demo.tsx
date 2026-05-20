"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";

const models = [
  { name: "GPT 4o (recommended)", value: "openai/gpt-4o" },
  {
    name: "Gemini 2.0 Flash Lite (may refuse to auto-pay)",
    value: "google/gemini-2.0-flash-lite",
  },
];

const suggestions: Record<string, string> = {
  "Equity research · NVDA":
    "Use the get_equity_research tool to pull a short research note on NVDA.",
  "Market commentary · semis":
    "Use the get_market_commentary tool for a one-paragraph qualitative read on the semiconductors sector.",
  "Mini backtest · AAPL":
    "Use the run_mini_backtest tool on AAPL with the moving-average-crossover strategy.",
  "Health check · agent":
    "Use ping_agent to confirm the seller agent is reachable.",
};

const PAID_TOOL_NAMES = [
  "get_equity_research",
  "get_market_commentary",
  "run_mini_backtest",
];

interface MaybeToolPart {
  type?: string;
  toolName?: string;
  state?: string;
}

function getToolName(p: unknown): string {
  const pa = p as MaybeToolPart;
  if (pa.type === "dynamic-tool") return pa.toolName ?? "";
  if (pa.type?.startsWith("tool-")) return pa.type.slice(5);
  return "";
}

function nowTime(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export function ChatDemo() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status } = useChat({
    onError: (error) => console.error(error),
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll log to bottom as it grows.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input }, { body: { model } });
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestions[suggestion] }, { body: { model } });
  };

  return (
    <section id="demo" data-reveal className="border-b border-[var(--x-border)]">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--x-text-subtle)] font-mono mb-3">
              Live demo · click → settle on-chain
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.025em] chrome-text">
              Agent pays an API, in real time.
            </h2>
          </div>
          <p className="text-sm text-[var(--x-text-muted)] max-w-md font-mono">
            Each preset issues a paid MCP request. Server 402 →
            EIP-3009 sign → retry with X-PAYMENT → on-chain settlement
            → tx hash. End-to-end in 2-4 seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-px bg-[var(--x-border)] border border-[var(--x-border)]">
          <div className="overflow-hidden bg-[var(--x-bg)] flex flex-col">
            <div className="border-b border-[var(--x-border)] px-4 py-2.5 bg-black text-[var(--x-chrome-2)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--x-accent-bright)] diode shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                tty · agent log
              </div>
              <div className="text-[10.5px] font-mono text-[var(--x-text-subtle)]">
                eip155:84532 · USDC
              </div>
            </div>

            <div
              ref={scrollRef}
              className="min-h-[420px] max-h-[640px] overflow-y-auto bg-[var(--x-bg)] font-mono text-[12.5px] leading-relaxed"
            >
              {messages.length === 0 && (
                <div className="px-4 py-6 text-[var(--x-text-subtle)]">
                  <span className="text-[var(--x-accent)]">$</span> _ awaiting
                  input · click a preset below to issue a paid request.
                </div>
              )}

              {messages.map((message) => {
                const paidToolCounts = new Map<string, number>();
                message.parts.forEach((p) => {
                  const name = getToolName(p);
                  if (PAID_TOOL_NAMES.some((n) => name.includes(n))) {
                    paidToolCounts.set(
                      name,
                      (paidToolCounts.get(name) ?? 0) + 1
                    );
                  }
                });
                const firstSeen = new Set<string>();
                const role = message.role;

                return (
                  <div
                    key={message.id}
                    className="px-4 py-2 border-b border-[var(--x-border)]/40 last:border-0"
                  >
                    {message.parts.map((part, i) => {
                      const partTyped = part as MaybeToolPart & {
                        text?: string;
                        input?: unknown;
                      };

                      if (partTyped.type === "text") {
                        const text = partTyped.text ?? "";
                        const tag =
                          role === "user"
                            ? { label: "user", cls: "text-[var(--x-chrome-2)]" }
                            : { label: "agent", cls: "text-[var(--x-accent)]" };
                        return (
                          <LogLine
                            key={`${message.id}-${i}`}
                            tag={tag.label}
                            tagCls={tag.cls}
                            text={text}
                          />
                        );
                      }

                      if (
                        partTyped.type === "dynamic-tool" ||
                        partTyped.type?.startsWith("tool-")
                      ) {
                        const toolName = getToolName(part);
                        const isPaidTool = PAID_TOOL_NAMES.some((n) =>
                          toolName.includes(n)
                        );
                        if (
                          isPaidTool &&
                          (paidToolCounts.get(toolName) ?? 0) > 1 &&
                          !firstSeen.has(toolName)
                        ) {
                          firstSeen.add(toolName);
                          return null;
                        }
                        return (
                          <ToolLine
                            key={`${message.id}-${i}`}
                            toolName={toolName || partTyped.type || "tool"}
                            input={
                              partTyped.input
                                ? JSON.stringify(partTyped.input)
                                : ""
                            }
                            state={partTyped.state ?? "?"}
                          />
                        );
                      }

                      return null;
                    })}
                  </div>
                );
              })}

              {status === "submitted" && (
                <div className="px-4 py-2 font-mono text-[12px] text-[var(--x-text-subtle)] flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">[{nowTime()}]</span>
                  <span className="text-[var(--x-accent)]">[sys]</span>
                  <span className="inline-block w-2 h-3 bg-[var(--x-accent)] animate-pulse" />
                  <span>working · network round trip</span>
                </div>
              )}

              {status === "error" && (
                <div className="px-4 py-2 font-mono text-[12px] text-amber-300">
                  <span className="text-[var(--x-text-subtle)]">[{nowTime()}]</span>{" "}
                  [sys] agent stream errored · check vercel runtime logs
                </div>
              )}
            </div>

            <div className="border-t border-[var(--x-border)] px-3 py-3 bg-[var(--x-bg-elevated)]">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {Object.keys(suggestions).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="rounded-sm border border-[var(--x-border-bright)] px-2.5 py-1 text-[10.5px] font-mono uppercase tracking-[0.18em] text-[var(--x-text)] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
                <span className="font-mono text-[var(--x-accent)] self-center text-sm select-none">
                  $
                </span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type a request, or click a preset above"
                  className="flex-1 bg-[var(--x-bg)] border border-[var(--x-border-bright)] rounded-sm px-3 py-2 font-mono text-[12.5px] text-[var(--x-text)] placeholder:text-[var(--x-text-subtle)] focus:outline-none focus:border-[var(--x-accent)]"
                />
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-[var(--x-bg)] border border-[var(--x-border-bright)] rounded-sm px-2 py-2 font-mono text-[10.5px] text-[var(--x-text)] focus:outline-none focus:border-[var(--x-accent)]"
                >
                  {models.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={!input || status === "submitted"}
                  className="rounded-sm bg-gradient-to-b from-[var(--x-chrome-1)] to-[var(--x-chrome-4)] text-black px-3 py-2 text-[10.5px] font-mono uppercase tracking-[0.22em] hover:from-[var(--x-accent)] hover:to-[var(--x-accent-bright)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  send
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-px text-sm bg-[var(--x-border)] flex flex-col">
            <ToolCard
              name="get_equity_research"
              price="0.005 USDC"
              priceAtomic="5,000"
              kind="paid"
              detail="Returns a short qualitative note for a curated ticker (NVDA, AAPL, MSFT)."
            />
            <ToolCard
              name="get_market_commentary"
              price="0.003 USDC"
              priceAtomic="3,000"
              kind="paid"
              detail="Returns a one-paragraph qualitative sector read (semis, banks, energy, payments)."
            />
            <ToolCard
              name="run_mini_backtest"
              price="0.010 USDC"
              priceAtomic="10,000"
              kind="paid"
              detail="Returns deterministically generated synthetic backtest statistics."
            />
            <ToolCard
              name="ping_agent"
              price="Free"
              kind="free"
              detail="Health check, confirms the seller agent and network."
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function LogLine({
  tag,
  tagCls,
  text,
}: {
  tag: string;
  tagCls: string;
  text: string;
}) {
  return (
    <div className="font-mono text-[12.5px] leading-relaxed flex gap-3 py-0.5">
      <span className="text-[var(--x-text-subtle)] shrink-0">
        [{nowTime()}]
      </span>
      <span className={`${tagCls} shrink-0 uppercase tracking-[0.18em]`}>
        [{tag}]
      </span>
      <span className="text-[var(--x-text)] whitespace-pre-wrap break-words">
        {text}
      </span>
    </div>
  );
}

function ToolLine({
  toolName,
  input,
  state,
}: {
  toolName: string;
  input: string;
  state: string;
}) {
  const PAID = ["get_equity_research", "get_market_commentary", "run_mini_backtest"];
  const isPaid = PAID.some((n) => toolName.includes(n));
  const label = toolName.startsWith("dynamic-tool")
    ? toolName
    : toolName.replace(/^tool-/, "");
  const trimmedInput =
    input.length > 80 ? `${input.slice(0, 78)}…` : input;
  return (
    <div className="font-mono text-[12px] leading-relaxed flex gap-3 py-0.5 text-[var(--x-text-muted)]">
      <span className="text-[var(--x-text-subtle)] shrink-0">
        [{nowTime()}]
      </span>
      <span
        className={`shrink-0 uppercase tracking-[0.18em] ${isPaid ? "text-[var(--x-accent)]" : "text-[var(--x-text-muted)]"}`}
      >
        [{isPaid ? "tx" : "tool"}]
      </span>
      <span>
        <span className={isPaid ? "text-[var(--x-accent)]" : "text-[var(--x-text)]"}>
          {label}
        </span>
        {trimmedInput && (
          <span className="text-[var(--x-text-subtle)]"> {trimmedInput}</span>
        )}
        <span className="text-[var(--x-text-subtle)]"> · </span>
        <span className="text-[var(--x-text-muted)]">{state}</span>
      </span>
    </div>
  );
}

function ToolCard({
  name,
  price,
  priceAtomic,
  kind,
  detail,
}: {
  name: string;
  price: string;
  priceAtomic?: string;
  kind: "paid" | "free";
  detail: string;
}) {
  return (
    <div className="p-3 bg-[var(--x-bg)] flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <code className="text-xs font-mono text-[var(--x-text)]">{name}</code>
        <span
          className={`text-[9.5px] font-mono uppercase tracking-[0.22em] px-1.5 py-0.5 ${kind === "paid" ? "border border-[var(--x-accent)]/40 text-[var(--x-accent)]" : "border border-[var(--x-border-bright)] text-[var(--x-text-subtle)]"}`}
        >
          {kind === "paid" ? "paid" : "free"}
        </span>
      </div>
      <div className="font-mono text-xs text-[var(--x-text)] mb-1.5">
        {price}
        {priceAtomic && (
          <span className="text-[var(--x-text-subtle)]"> · {priceAtomic} atomic</span>
        )}
      </div>
      <p className="text-[11px] text-[var(--x-text-subtle)] leading-relaxed font-mono">
        {detail}
      </p>
    </div>
  );
}
