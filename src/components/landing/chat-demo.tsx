"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";

const models = [
  { name: "GPT 4o (recommended)", value: "openai/gpt-4o" },
  {
    name: "Gemini 2.0 Flash Lite (may refuse to auto-pay)",
    value: "google/gemini-2.0-flash-lite",
  },
];

interface PresetConfig {
  label: string;
  prompt: string;
  tool:
    | "get_equity_research"
    | "get_market_commentary"
    | "run_mini_backtest"
    | "ping_agent";
  args: Record<string, unknown>;
}

const PRESETS: PresetConfig[] = [
  {
    label: "Equity research · NVDA",
    prompt: "get_equity_research(ticker=NVDA)",
    tool: "get_equity_research",
    args: { ticker: "NVDA" },
  },
  {
    label: "Market commentary · semis",
    prompt: "get_market_commentary(sector=semiconductors)",
    tool: "get_market_commentary",
    args: { sector: "semiconductors" },
  },
  {
    label: "Mini backtest · AAPL",
    prompt: "run_mini_backtest(ticker=AAPL, strategy=moving-average-crossover)",
    tool: "run_mini_backtest",
    args: { ticker: "AAPL", strategy: "moving-average-crossover" },
  },
  {
    label: "Health check · agent",
    prompt: "ping_agent()",
    tool: "ping_agent",
    args: {},
  },
];

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

type DirectEntry =
  | {
      id: string;
      ts: number;
      kind: "user";
      text: string;
    }
  | {
      id: string;
      ts: number;
      kind: "tool-call";
      toolName: string;
      input: string;
      state: "pending" | "settled" | "free";
    }
  | {
      id: string;
      ts: number;
      kind: "agent";
      text: string;
    }
  | {
      id: string;
      ts: number;
      kind: "settlement";
      text: string;
      txHash?: string;
      network?: string;
    }
  | {
      id: string;
      ts: number;
      kind: "error";
      text: string;
    };

interface ToolApiResponse {
  tool: string;
  args: Record<string, unknown>;
  price: { atomic: number; usdc: number };
  network: string;
  buyerAddress?: string;
  paid?: boolean;
  transactionHash?: string;
  content?: string;
  result?: {
    content?: Array<{ type: string; text: string }>;
  };
  elapsedMs?: number;
}

interface ToolApiError {
  error: string;
  message?: string;
}

function isErrorResponse(j: unknown): j is ToolApiError {
  return typeof j === "object" && j !== null && "error" in j;
}

function formatToolResult(json: ToolApiResponse): string {
  const text = json.content ?? json.result?.content?.[0]?.text;
  if (!text) return "(no content)";
  try {
    const parsed: unknown = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
}

function formatSettlement(
  toolName: string,
  price: ToolApiResponse["price"],
  network: string,
  elapsedMs?: number,
): string {
  if (toolName === "ping_agent" || price.atomic === 0) {
    const networkLabel =
      network === "base-sepolia" ? "Base Sepolia" : "Base mainnet";
    const elapsed = elapsedMs != null ? ` (${elapsedMs}ms)` : "";
    return `Health check returned ok on ${networkLabel}${elapsed}. No payment required.`;
  }
  const networkLabel =
    network === "base-sepolia" ? "Base Sepolia" : "Base mainnet";
  const usdc = price.usdc.toFixed(3);
  const atomic = price.atomic.toLocaleString();
  return `Settled ${usdc} USDC (${atomic} atomic units) on ${networkLabel}.`;
}

export function ChatDemo() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status } = useChat({
    onError: (error) => console.error(error),
  });

  const [directEntries, setDirectEntries] = useState<DirectEntry[]>([]);
  const [directBusy, setDirectBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll log to bottom as it grows.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status, directEntries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input }, { body: { model } });
      setInput("");
    }
  };

  const appendDirect = (entry: DirectEntry) => {
    setDirectEntries((prev) => [...prev, entry]);
  };

  const runPreset = async (preset: PresetConfig) => {
    if (directBusy) return;
    setDirectBusy(true);
    const baseId = `${preset.tool}-${Date.now()}`;
    const ts = Date.now();
    const isPaid = preset.tool !== "ping_agent";

    appendDirect({
      id: `${baseId}-user`,
      ts,
      kind: "user",
      text: preset.prompt,
    });
    appendDirect({
      id: `${baseId}-call`,
      ts: ts + 1,
      kind: "tool-call",
      toolName: preset.tool,
      input: JSON.stringify(preset.args),
      state: isPaid ? "pending" : "free",
    });

    try {
      const res = await fetch("/api/run-tool", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool: preset.tool, args: preset.args }),
      });
      const json: unknown = await res.json();
      if (!res.ok || isErrorResponse(json)) {
        const message =
          isErrorResponse(json) && json.message
            ? json.message
            : `HTTP ${res.status}`;
        appendDirect({
          id: `${baseId}-err`,
          ts: Date.now(),
          kind: "error",
          text: `tool call failed · ${message}`,
        });
        return;
      }

      const typed = json as ToolApiResponse;

      // Update the prior tool-call entry to settled.
      setDirectEntries((prev) =>
        prev.map((entry) =>
          entry.id === `${baseId}-call` && entry.kind === "tool-call"
            ? { ...entry, state: isPaid ? "settled" : "free" }
            : entry,
        ),
      );

      appendDirect({
        id: `${baseId}-result`,
        ts: Date.now(),
        kind: "agent",
        text: formatToolResult(typed),
      });

      appendDirect({
        id: `${baseId}-settlement`,
        ts: Date.now() + 1,
        kind: "settlement",
        text: formatSettlement(
          preset.tool,
          typed.price,
          typed.network,
          typed.elapsedMs,
        ),
        txHash: typed.transactionHash,
        network: typed.network,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      appendDirect({
        id: `${baseId}-err`,
        ts: Date.now(),
        kind: "error",
        text: `network error · ${message}`,
      });
    } finally {
      setDirectBusy(false);
    }
  };

  const isEmpty = messages.length === 0 && directEntries.length === 0;

  // Combined ordered render list of LLM messages (legacy) and direct entries.
  const renderItems = useMemo(() => {
    const llmItems = messages.map((m, idx) => ({
      kind: "llm" as const,
      ts: idx, // useChat preserves order; treat index as a sort key
      message: m,
    }));
    const directItems = directEntries.map((entry) => ({
      kind: "direct" as const,
      ts: entry.ts,
      entry,
    }));
    // direct entries dominate ordering; LLM messages render before all direct entries
    return [...llmItems, ...directItems];
  }, [messages, directEntries]);

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
            → tx hash. Sequencer-confirmed in roughly 2-4 seconds;
            L1 finality takes longer. Presets call the paid tools
            directly; the model dropdown adds free-form LLM
            orchestration on top of the same handshake.
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
              {isEmpty && (
                <div className="px-4 py-6 text-[var(--x-text-subtle)]">
                  <span className="text-[var(--x-accent)]">$</span> _ awaiting
                  input · click a preset below to issue a paid request.
                </div>
              )}

              {renderItems.map((item) => {
                if (item.kind === "llm") {
                  const message = item.message;
                  const paidToolCounts = new Map<string, number>();
                  message.parts.forEach((p) => {
                    const name = getToolName(p);
                    if (PAID_TOOL_NAMES.some((n) => name.includes(n))) {
                      paidToolCounts.set(
                        name,
                        (paidToolCounts.get(name) ?? 0) + 1,
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
                              ? {
                                  label: "user",
                                  cls: "text-[var(--x-chrome-2)]",
                                }
                              : {
                                  label: "agent",
                                  cls: "text-[var(--x-accent)]",
                                };
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
                            toolName.includes(n),
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
                }

                // direct entry
                const entry = item.entry;
                if (entry.kind === "user") {
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-2 border-b border-[var(--x-border)]/40"
                    >
                      <LogLine
                        tag="user"
                        tagCls="text-[var(--x-chrome-2)]"
                        text={entry.text}
                      />
                    </div>
                  );
                }
                if (entry.kind === "tool-call") {
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-2 border-b border-[var(--x-border)]/40"
                    >
                      <ToolLine
                        toolName={entry.toolName}
                        input={entry.input}
                        state={entry.state}
                      />
                    </div>
                  );
                }
                if (entry.kind === "agent") {
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-2 border-b border-[var(--x-border)]/40"
                    >
                      <LogLine
                        tag="agent"
                        tagCls="text-[var(--x-accent)]"
                        text={entry.text}
                      />
                    </div>
                  );
                }
                if (entry.kind === "settlement") {
                  const explorerBase =
                    entry.network === "base"
                      ? "https://basescan.org/tx/"
                      : "https://sepolia.basescan.org/tx/";
                  const shortHash = entry.txHash
                    ? `${entry.txHash.slice(0, 10)}…${entry.txHash.slice(-8)}`
                    : null;
                  return (
                    <div
                      key={entry.id}
                      className="px-4 py-2 border-b border-[var(--x-border)]/40"
                    >
                      <LogLine
                        tag="settle"
                        tagCls="text-[var(--x-accent-bright)]"
                        text={entry.text}
                      />
                      {entry.txHash && shortHash && (
                        <div className="font-mono text-[12px] leading-relaxed flex gap-3 py-0.5 pl-[7.5rem]">
                          <a
                            href={`${explorerBase}${entry.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--x-text-subtle)] hover:text-[var(--x-accent)] underline decoration-dotted"
                          >
                            tx {shortHash} ↗
                          </a>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <div
                    key={entry.id}
                    className="px-4 py-2 border-b border-[var(--x-border)]/40"
                  >
                    <LogLine
                      tag="error"
                      tagCls="text-amber-300"
                      text={entry.text}
                    />
                  </div>
                );
              })}

              {(status === "submitted" || directBusy) && (
                <div className="px-4 py-2 font-mono text-[12px] text-[var(--x-text-subtle)] flex items-center gap-2">
                  <span className="text-[var(--x-text-subtle)]">
                    [{nowTime()}]
                  </span>
                  <span className="text-[var(--x-accent)]">[sys]</span>
                  <span className="inline-block w-2 h-3 bg-[var(--x-accent)] animate-pulse" />
                  <span>
                    {directBusy
                      ? "signing eip-3009 · awaiting settlement"
                      : "working · network round trip"}
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="px-4 py-2 font-mono text-[12px] text-amber-300">
                  <span className="text-[var(--x-text-subtle)]">
                    [{nowTime()}]
                  </span>{" "}
                  [sys] agent stream errored · free-form chat needs paid AI
                  Gateway credits. presets above still settle on-chain.
                </div>
              )}
            </div>

            <div className="border-t border-[var(--x-border)] px-3 py-3 bg-[var(--x-bg-elevated)]">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => runPreset(p)}
                    disabled={directBusy}
                    className="rounded-sm border border-[var(--x-border-bright)] px-2.5 py-1 text-[10.5px] font-mono uppercase tracking-[0.18em] text-[var(--x-text)] hover:border-[var(--x-accent)] hover:text-[var(--x-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p.label}
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
