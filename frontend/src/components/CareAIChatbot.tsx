import { useEffect, useRef, useState } from "react";
import { Bot, Check, Globe, Loader2, Send, Sparkles, X } from "lucide-react";

type Language = {
  id: "en" | "my" | "zh";
  label: string;
  flag: string;
  placeholder: string;
  greeting: string;
  error: string;
  loading: string;
};

type ChatMessage = { sender: "assistant" | "user"; text: string };

const LANGUAGES: Language[] = [
  {
    id: "en",
    label: "English",
    flag: "🇺🇸",
    placeholder: "Type your message in English...",
    greeting: "Hello. I am your CareAI Assistant. How can I help with your wellness today?",
    error: "I could not reach CareAI right now. Please try again shortly.",
    loading: "CareAI is thinking...",
  },
  {
    id: "my",
    label: "မြန်မာ",
    flag: "🇲🇲",
    placeholder: "မြန်မာဘာသာဖြင့် မေးမြန်းပါ...",
    greeting: "မင်္ဂလာပါ။ ကျွန်တော်က CareAI Assistant ဖြစ်ပါတယ်။ ဒီနေ့ သင့်ကျန်းမာရေးအတွက် ဘာကူညီပေးရမလဲ။",
    error: "လောလောဆယ် CareAI နှင့် ချိတ်ဆက်၍ မရပါ။ ခဏနေပြီး ထပ်ကြိုးစားပါ။",
    loading: "CareAI က စဉ်းစားနေပါတယ်...",
  },
  {
    id: "zh",
    label: "简体中文",
    flag: "🇨🇳",
    placeholder: "用中文输入您的健康问题...",
    greeting: "你好。我是您的 CareAI 助手。今天有什么健康问题需要帮助？",
    error: "CareAI 暂时无法连接，请稍后再试。",
    loading: "CareAI 正在思考...",
  },
];

const FULL_BADGE_TEXT = "Ask CareAI assistant!";

export function CareAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      setTypedText(FULL_BADGE_TEXT.slice(0, index));
      index = index >= FULL_BADGE_TEXT.length ? 0 : index + 1;
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function selectLanguage(language: Language) {
    setSelectedLanguage(language);
    setMessages([{ sender: "assistant", text: language.greeting }]);
  }

  function resetLanguage() {
    setSelectedLanguage(null);
    setMessages([]);
    setInput("");
  }

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading || !selectedLanguage) return;

    setMessages((current) => [...current, { sender: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/care-ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, language: selectedLanguage.id }),
      });
      const payload = (await response.json().catch(() => null)) as { reply?: unknown } | null;
      if (!response.ok || typeof payload?.reply !== "string") throw new Error("Chat failed");
      setMessages((current) => [...current, { sender: "assistant", text: payload.reply }]);
    } catch {
      setMessages((current) => [...current, { sender: "assistant", text: selectedLanguage.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {!isOpen ? (
        <div className="flex items-center gap-2">
          <div className="hidden max-w-48 rounded-xl border border-cyan-100 bg-white px-3 py-2 text-xs font-semibold text-primary shadow-lg sm:block">
            <span>{typedText}</span>
            <span className="ml-0.5 animate-pulse text-cyan-500">|</span>
          </div>
          <button
            type="button"
            aria-label="Open CareAI Assistant"
            onClick={() => setIsOpen(true)}
            className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_14px_34px_-10px_rgba(37,99,235,0.7)] transition-transform hover:scale-105 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
          >
            <Bot className="size-7" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <section
          aria-label="CareAI Assistant"
          className="flex h-[min(520px,calc(100dvh-2rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_24px_70px_-25px_rgba(15,35,66,0.5)]"
        >
          <header className="flex items-center justify-between bg-[linear-gradient(110deg,#1d4ed8,#0e7490)] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-2"><Sparkles className="size-4" aria-hidden="true" /></div>
              <div>
                <h2 className="text-sm font-bold">CareAI Assistant</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-cyan-100">
                  <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" /> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {selectedLanguage && (
                <button type="button" onClick={resetLanguage} title="Change language" className="rounded-lg px-2 py-1 text-[10px] font-bold uppercase hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <Globe className="mr-1 inline size-3.5" aria-hidden="true" />{selectedLanguage.id}
                </button>
              )}
              <button type="button" aria-label="Minimize CareAI Assistant" onClick={() => setIsOpen(false)} className="rounded-lg p-2 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-4">
            {!selectedLanguage ? (
              <div className="my-auto rounded-2xl border border-cyan-100 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-primary"><Globe className="size-6" aria-hidden="true" /></div>
                <h3 className="text-sm font-bold text-slate-900">Choose your chat language</h3>
                <p className="mt-1 text-xs text-slate-500">CareAI will greet you in your preferred language.</p>
                <div className="mt-4 grid gap-2">
                  {LANGUAGES.map((language) => (
                    <button key={language.id} type="button" onClick={() => selectLanguage(language)} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <span><span className="mr-2">{language.flag}</span>{language.label}</span>
                      <Check className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            ) : messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`flex ${message.sender === "user" ? "justify-end" : "items-start gap-2"}`}>
                {message.sender === "assistant" && <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-primary"><Bot className="size-3.5" aria-hidden="true" /></div>}
                <p className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${message.sender === "user" ? "rounded-tr-sm bg-primary font-medium text-white" : "rounded-tl-sm border border-slate-100 bg-white text-slate-700 shadow-sm"}`}>{message.text}</p>
              </div>
            ))}
            {loading && selectedLanguage && <div className="flex items-center gap-2 pl-2 text-xs text-slate-400"><Loader2 className="size-3.5 animate-spin text-primary" aria-hidden="true" />{selectedLanguage.loading}</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 bg-white p-3">
            <input type="text" value={input} disabled={!selectedLanguage || loading} onChange={(event) => setInput(event.target.value)} placeholder={selectedLanguage?.placeholder ?? "Choose a language above..."} aria-label="Message CareAI" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-cyan-100 disabled:opacity-50" />
            <button type="submit" aria-label="Send message" disabled={!input.trim() || loading || !selectedLanguage} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><Send className="size-4" aria-hidden="true" /></button>
          </form>
        </section>
      )}
    </div>
  );
}