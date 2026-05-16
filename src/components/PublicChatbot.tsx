"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useSite } from "@/components/SiteContext";
import {
  answer,
  WELCOME_SUGGESTIONS,
  type BotResponse,
  type BotPart,
} from "@/lib/public-chat";

type Msg = { role: "user"; text: string } | { role: "bot"; response: BotResponse };

export default function PublicChatbot() {
  const site = useSite();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([{ role: "bot", response: answer("hi", { site }) }]);
    }
  }, [open, messages.length, site]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "bot", response: answer(q, { site }) }]);
    setInput("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-plum text-bg shadow-xl ring-2 ring-blush/40 transition hover:bg-plum-deep hover:scale-105 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with the studio"
          className="fixed bottom-22 right-5 z-40 flex h-[34rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-2xl md:bottom-24 md:right-6"
          style={{ bottom: "5.5rem" }}
        >
          <header className="flex items-center gap-3 border-b border-line bg-plum px-4 py-3 text-bg">
            <span className="font-display text-base tracking-tight">
              {site.studio.monogram}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Talk to {site.studio.name}</p>
              <p className="truncate text-[10px] opacity-80">
                Quick answers about coverage, pricing, and dates.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded p-1 text-bg/80 hover:bg-plum-deep"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scroll} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-plum px-3 py-2 text-bg">
                    {m.text}
                  </div>
                </div>
              ) : (
                <BotBubble key={i} response={m.response} onSuggest={send} onClose={() => setOpen(false)} />
              ),
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line bg-paper p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about coverage, pricing, dates…"
                className="flex-1 rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink placeholder:text-muted focus:border-plum focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-bg hover:bg-plum-deep disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {messages.length <= 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {WELCOME_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line bg-bg px-2.5 py-0.5 text-[11px] text-ink-soft hover:border-plum hover:text-plum"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}

function BotBubble({
  response,
  onSuggest,
  onClose,
}: {
  response: BotResponse;
  onSuggest: (s: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2 rounded-2xl rounded-bl-sm bg-bg-soft/60 px-3 py-2 text-ink">
        {response.parts.map((p, i) => renderPart(p, i, onClose))}
        {response.suggestions && response.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {response.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggest(s)}
                className="rounded-full border border-line bg-paper px-2 py-0.5 text-[11px] text-ink-soft hover:border-plum hover:text-plum"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderPart(p: BotPart, i: number, onClose: () => void) {
  if (p.kind === "text") return <p key={i}>{p.text}</p>;
  if (p.kind === "bullets") {
    return (
      <ul key={i} className="list-disc space-y-0.5 pl-4 text-[13px]">
        {p.items.map((it, j) => (
          <li key={j}>{it}</li>
        ))}
      </ul>
    );
  }
  // link — clicking an in-page anchor should also close the panel
  return (
    <a
      key={i}
      href={p.href}
      onClick={() => {
        if (p.href.startsWith("#")) onClose();
      }}
      target={p.href.startsWith("http") ? "_blank" : undefined}
      rel={p.href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="inline-flex items-center rounded-full bg-plum px-3 py-1 text-xs text-bg hover:bg-plum-deep"
    >
      {p.label} →
    </a>
  );
}
