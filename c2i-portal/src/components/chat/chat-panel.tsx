"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Loader2, Sparkles, StopCircle, RotateCcw } from "lucide-react";
import { cn } from "../../lib/utils";
import type { AgentId } from "../../lib/personas";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AGENT_LABELS: Record<AgentId, { label: string; hint: string }> = {
  router: { label: "Auto-route", hint: "Let the router pick the right agent" },
  rfp: { label: "RFP response", hint: "Parse RFP, build compliance matrix, draft skeleton deck" },
  solution: { label: "Solution architect", hint: "A/B/C architecture with tradeoffs" },
  sme: { label: "SME matcher", hint: "Curate pursuit team from graph + HRMS" },
  deal: { label: "Deal qualifier", hint: "Go/No-Go with win/loss evidence" },
  pricing: { label: "Pricing / PIP", hint: "TCV ballpark + PIP sheet" },
  compliance: { label: "Compliance", hint: "Clause checks + litigation flags" },
  diagram: { label: "Diagram / content", hint: "Mermaid, drawio, mockups, one-pagers" },
};

interface ChatPanelProps {
  initialAgent: AgentId;
  allowedAgents: AgentId[];
}

export function ChatPanel({ initialAgent, allowedAgents }: ChatPanelProps) {
  const [agentId, setAgentId] = useState<AgentId>(initialAgent);
  // v6: useChat no longer manages input — own it locally.
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Static endpoint, so the transport has no deps. agentId is sent per-message
  // (see handleSubmit) to avoid capturing a stale value here.
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, stop, setMessages } = useChat({ transport });

  // v6: derive loading from status instead of the removed isLoading flag.
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    // Pass the current agentId per-send so switching agents takes effect immediately.
    sendMessage({ text }, { body: { agentId } });
    setInput("");
  };

  const isEmpty = messages.length === 0;
  const agentInfo = AGENT_LABELS[agentId];

  return (
    <div className="flex flex-col h-full">
      {/* Agent selector bar */}
      <div className="border-b border-border bg-bg-elevated/50 px-6 py-3 flex items-center gap-3">
        <Sparkles className="size-4 text-accent shrink-0" />
        <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {allowedAgents.map((id) => {
            const meta = AGENT_LABELS[id];
            return (
              <button
                key={id}
                onClick={() => setAgentId(id)}
                disabled={isLoading}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                  agentId === id
                    ? "bg-accent text-accent-fg"
                    : "text-fg-muted hover:bg-bg-overlay hover:text-fg",
                  isLoading && "opacity-50 cursor-not-allowed",
                )}
                title={meta.hint}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-fg-muted hover:text-fg flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="size-3" />
            New
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {isEmpty ? (
          <EmptyState agentLabel={agentInfo.label} agentHint={agentInfo.hint} />
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {messages.map((m) => (
              <Message key={m.id} role={m.role} parts={m.parts} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 text-fg-muted text-sm">
                <Loader2 className="size-4 animate-spin" />
                <span className="font-mono text-xs">{agentInfo.label} thinking…</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-bg-elevated/30 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative rounded-lg border border-border bg-bg-elevated focus-within:border-border-strong focus-within:ring-1 focus-within:ring-border-strong transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${agentInfo.label.toLowerCase()}…`}
              rows={2}
              className="w-full resize-none bg-transparent px-4 py-3 pr-14 text-sm text-fg placeholder:text-fg-subtle focus:outline-none scrollbar-thin"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="size-8 rounded-md bg-danger/15 text-danger flex items-center justify-center hover:bg-danger/25 transition-colors"
                  aria-label="Stop"
                >
                  <StopCircle className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="size-8 rounded-md bg-accent text-accent-fg flex items-center justify-center hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send"
                >
                  <Send className="size-4" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-fg-subtle">
            <span className="font-mono">
              {agentId} &middot; enter to send, shift+enter for newline
            </span>
            <span className="font-mono">{input.length} chars</span>
          </div>
        </form>
      </div>
    </div>
  );
}

function Message({ role, parts }: { role: string; parts: UIMessage["parts"] }) {
  const isUser = role === "user";
  // v6: text lives in parts[] (type: "text"), not a flat `content` string.
  const text = parts.map((p) => (p.type === "text" ? p.text : "")).join("");

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="size-7 shrink-0 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Sparkles className="size-3.5 text-accent" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
          isUser ? "bg-fg text-bg" : "bg-bg-elevated border border-border text-fg",
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{text}</div>
        ) : (
          <div className="prose prose-sm max-w-none prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-p:my-2 prose-pre:bg-bg prose-pre:border prose-pre:border-border prose-code:font-mono prose-code:text-[13px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ agentLabel, agentHint }: { agentLabel: string; agentHint: string }) {
  return (
    <div className="h-full flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-3">
        <div className="size-12 mx-auto rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Sparkles className="size-5 text-accent" />
        </div>
        <h2 className="text-lg font-medium tracking-tight">{agentLabel}</h2>
        <p className="text-sm text-fg-muted leading-relaxed">{agentHint}</p>
        <div className="pt-2 font-mono text-[11px] text-fg-subtle">
          start typing below or pick another agent above
        </div>
      </div>
    </div>
  );
}