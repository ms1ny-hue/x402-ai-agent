"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
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
  {
    name: "GPT 4o (recommended)",
    value: "openai/gpt-4o",
  },
  {
    name: "Gemini 2.0 Flash Lite (cheaper, may refuse to auto-pay)",
    value: "google/gemini-2.0-flash-lite",
  },
];
const suggestions = {
  "Equity research on NVDA":
    "Use the get_equity_research tool to pull a short research note on NVDA.",
  "Market commentary on semis":
    "Use the get_market_commentary tool for a one-paragraph qualitative read on the semiconductors sector.",
  "Mini backtest on AAPL":
    "Use the run_mini_backtest tool on AAPL with the moving-average-crossover strategy.",
  "Check agent wallet balance":
    "Use ping_agent to confirm the agent wallet is reachable.",
};

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status } = useChat({
    onError: (error) => console.error(error),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
          },
        }
      );
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion: keyof typeof suggestions) => {
    sendMessage(
      { text: suggestions[suggestion] },
      {
        body: {
          model: model,
        },
      }
    );
  };

  return (
    <div className="w-full p-6 relative size-full max-w-4xl mx-auto">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => {
              // Pre-scan: find paid-tool names that appear more than once in
              // this message. The first occurrence is the x402 handshake
              // (returns 402, rendered as "Error"). The retry below it is
              // the real success. Hide the first occurrence so visitors do
              // not think the demo broke.
              const PAID_TOOL_NAMES = [
                "get_equity_research",
                "get_market_commentary",
                "run_mini_backtest",
              ];
              const getToolName = (p: unknown): string => {
                const pa = p as { type?: string; toolName?: string };
                if (pa.type === "dynamic-tool") return pa.toolName ?? "";
                if (pa.type?.startsWith("tool-")) return pa.type.slice(5);
                return "";
              };
              const paidToolCounts = new Map<string, number>();
              message.parts.forEach((p) => {
                const name = getToolName(p);
                if (PAID_TOOL_NAMES.some((n) => name.includes(n))) {
                  paidToolCounts.set(name, (paidToolCounts.get(name) ?? 0) + 1);
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
                      // If this paid tool appears more than once in the
                      // message, the first occurrence is the 402 handshake
                      // and gets hidden. The retry below it shows success.
                      if (
                        isPaidTool &&
                        (paidToolCounts.get(toolName) ?? 0) > 1 &&
                        !firstSeen.has(toolName)
                      ) {
                        firstSeen.add(toolName);
                        return null;
                      }
                      return (
                        <Tool defaultOpen={false} key={`${message.id}-${i}`}>
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
            {status === "error" && <div>Something went wrong</div>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <Suggestions className="justify-center">
          {Object.keys(suggestions).map((suggestion) => (
            <Suggestion
              key={suggestion}
              suggestion={suggestion}
              onClick={() =>
                handleSuggestionClick(suggestion as keyof typeof suggestions)
              }
              variant="outline"
              size="sm"
            />
          ))}
        </Suggestions>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            ref={(ref) => {
              if (ref) {
                ref.focus();
              }
            }}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
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
  );
};

export default ChatBotDemo;
