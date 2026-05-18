"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

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

function getToolName(p: unknown): string {
  const pa = p as { type?: string; toolName?: string };
  if (pa.type === "dynamic-tool") return pa.toolName ?? "";
  if (pa.type?.startsWith("tool-")) return pa.type.slice(5);
  return "";
}

export function ChatDemo() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status } = useChat({
    onError: (error) => console.error(error),
  });

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
    <section id="demo" className="border-b border-[#0a0e1a]/10">
      <div className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#0a0e1a]/55 font-mono mb-3">
              Live demo · click to trigger a payment
            </p>
            <h2 className="font-serif text-3xl md:text-5xl leading-tight tracking-[-0.02em]">
              An AI agent paying an API, <em>in real time.</em>
            </h2>
          </div>
          <p className="text-sm text-[#0a0e1a]/65 max-w-md">
            Each preset below issues an HTTP request to a paid MCP tool. The
            server returns 402, the agent signs an EIP-3009 authorization,
            the facilitator settles on-chain. Watch the result and the tx
            hash appear together.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          <div className="border border-[#0a0e1a]/15 rounded-lg overflow-hidden bg-[#fbfaf7] flex flex-col">
            <div className="border-b border-[#0a0e1a]/10 px-4 py-2.5 bg-[#0a0e1a] text-[#fbfaf7] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#56e0a0]" />
                Agent terminal
              </div>
              <div className="text-[11px] font-mono text-[#fbfaf7]/60">
                eip155:84532 · USDC
              </div>
            </div>

            <Conversation className="min-h-[420px] max-h-[640px]">
              <ConversationContent>
                {messages.length === 0 && (
                  <div className="px-2 py-8 text-center text-sm text-[#0a0e1a]/55">
                    Click a preset below to issue a paid request.
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
                  return (
                    <Message from={message.role} key={message.id}>
                      <MessageContent>
                        {message.parts.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            );
                          } else if (part.type === "reasoning") {
                            return (
                              <Reasoning
                                key={`${message.id}-${i}`}
                                className="w-full"
                                isStreaming={status === "streaming"}
                              >
                                <ReasoningTrigger />
                                <ReasoningContent>{part.text}</ReasoningContent>
                              </Reasoning>
                            );
                          } else if (
                            part.type === "dynamic-tool" ||
                            part.type.startsWith("tool-")
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
                              <Tool
                                defaultOpen={false}
                                key={`${message.id}-${i}`}
                              >
                                {/* @ts-expect-error */}
                                <ToolHeader part={part} />
                                <ToolContent>
                                  {/* @ts-expect-error */}
                                  <ToolInput input={part.input} />
                                  <ToolOutput
                                    // @ts-expect-error
                                    part={part}
                                    // @ts-expect-error
                                    network={message.metadata?.network}
                                  />
                                </ToolContent>
                              </Tool>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  );
                })}
                {status === "submitted" && <Loader />}
                {status === "error" && (
                  <div className="text-sm text-red-700 px-2 py-3">
                    The agent stream errored. Check Vercel runtime logs.
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="border-t border-[#0a0e1a]/10 px-3 py-3">
              <Suggestions className="justify-start">
                {Object.keys(suggestions).map((s) => (
                  <Suggestion
                    key={s}
                    suggestion={s}
                    onClick={() => handleSuggestionClick(s)}
                    variant="outline"
                    size="sm"
                  />
                ))}
              </Suggestions>
              <PromptInput onSubmit={handleSubmit} className="mt-3">
                <PromptInputTextarea
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  placeholder="Ask the agent something, or click a preset above…"
                />
                <PromptInputToolbar>
                  <PromptInputTools>
                    <PromptInputModelSelect
                      onValueChange={(v) => setModel(v)}
                      value={model}
                    >
                      <PromptInputModelSelectTrigger>
                        <PromptInputModelSelectValue />
                      </PromptInputModelSelectTrigger>
                      <PromptInputModelSelectContent>
                        {models.map((m) => (
                          <PromptInputModelSelectItem
                            key={m.value}
                            value={m.value}
                          >
                            {m.name}
                          </PromptInputModelSelectItem>
                        ))}
                      </PromptInputModelSelectContent>
                    </PromptInputModelSelect>
                  </PromptInputTools>
                  <PromptInputSubmit disabled={!input} status={status} />
                </PromptInputToolbar>
              </PromptInput>
            </div>
          </div>

          <aside className="space-y-4 text-sm">
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
    <div className="border border-[#0a0e1a]/15 rounded-lg p-3 bg-[#fbfaf7]">
      <div className="flex items-center justify-between mb-1.5">
        <code className="text-xs font-mono text-[#0a0e1a]">{name}</code>
        <span
          className={`text-[10px] font-mono uppercase tracking-[0.18em] px-1.5 py-0.5 rounded ${kind === "paid" ? "bg-[#ff6b1a]/15 text-[#ff6b1a]" : "bg-[#56e0a0]/20 text-[#0a0e1a]/70"}`}
        >
          {kind === "paid" ? "paid" : "free"}
        </span>
      </div>
      <div className="font-mono text-xs text-[#0a0e1a]/80 mb-1.5">
        {price}
        {priceAtomic && (
          <span className="text-[#0a0e1a]/45"> · {priceAtomic} atomic</span>
        )}
      </div>
      <p className="text-xs text-[#0a0e1a]/65 leading-relaxed">{detail}</p>
    </div>
  );
}
