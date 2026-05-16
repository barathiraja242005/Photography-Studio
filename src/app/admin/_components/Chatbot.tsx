"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import {
  answer,
  WELCOME_SUGGESTIONS,
  type BotResponse,
  type SiteData,
} from "./chatbot-rules";

type Msg =
  | { role: "user"; text: string }
  | { role: "bot"; response: BotResponse };

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [site, setSite] = useState<SiteData | null>(null);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);

  // Lazy-load site settings the first time the chat opens, so the bot
  // can answer "what services do we offer" from real data.
  useEffect(() => {
    if (!open || siteLoaded) return;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setSite((json.data ?? null) as SiteData | null);
        }
      } catch {
        /* offline / DB unreachable — bot still works without live data */
      } finally {
        setSiteLoaded(true);
      }
    })();
  }, [open, siteLoaded]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Welcome message on first open.
  useEffect(() => {
    if (open && messages.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([
        {
          role: "bot",
          response: answer("hi", { site }),
        },
      ]);
    }
  }, [open, messages.length, site]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const userMsg: Msg = { role: "user", text: q };
    const botMsg: Msg = { role: "bot", response: answer(q, { site }) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 md:bottom-6 md:right-6"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Admin assistant"
          className="fixed bottom-20 right-5 z-30 flex h-[32rem] w-[22rem] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl md:bottom-24 md:right-6"
        >
          <header className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
            <Sparkles className="h-4 w-4 text-neutral-700" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900">Admin helper</p>
              <p className="truncate text-[10px] text-neutral-500">
                Rule-based — answers about your fields, services, and tags.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded p-1 text-neutral-500 hover:bg-neutral-200"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scroll} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-lg rounded-br-sm bg-neutral-900 px-3 py-2 text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <BotBubble key={i} response={m.response} onSuggest={send} />
              ),
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-neutral-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, tags, fields…"
                className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded bg-neutral-900 px-3 py-2 text-white hover:bg-neutral-800 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {messages.length <= 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {WELCOME_SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-100"
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
}: {
  response: BotResponse;
  onSuggest: (s: string) => void;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2 rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2 text-neutral-800">
        {response.parts.map((p, i) => {
          if (p.kind === "text") {
            return <p key={i}>{p.text}</p>;
          }
          if (p.kind === "bullets") {
            return (
              <div key={i}>
                {p.title && <p className="mb-1 font-medium">{p.title}</p>}
                <ul className="list-disc space-y-0.5 pl-4 text-[13px]">
                  {p.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              </div>
            );
          }
          // code
          return (
            <pre key={i} className="overflow-x-auto rounded border border-neutral-200 bg-white p-2 text-[12px] text-neutral-700">
              {p.text}
            </pre>
          );
        })}
        {response.suggestions && response.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {response.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSuggest(s)}
                className="rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-50"
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
