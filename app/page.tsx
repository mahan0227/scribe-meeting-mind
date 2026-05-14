"use client";

import { useState } from "react";
import { ApiKeyBar, authHeaders, useOpenAISettings } from "@/components/ApiKeyBar";

export default function Home() {
  const settings = useOpenAISettings();
  const { apiKey, model } = settings;
  const [title, setTitle] = useState("Incident retro — checkout timeouts");
  const [attendees, setAttendees] = useState("Alex (EM), Sam (SRE), Jordan (FE), Priya (PM)");
  const [transcript, setTranscript] = useState(
    "Alex: Root cause still unclear — looks like DB connection pool saturation during flash sale. Sam: p99 doubled before traffic spike; suspect slow queries. Jordan: client retries amplified load. Priya: we need comms to merchants by EOD. Decision: enable adaptive concurrency limiter + add query guardrails. Action: Sam owns hotfix rollout tonight; Jordan adds jittered backoff; Priya drafts status page language.",
  );
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setOutput("");
    if (!apiKey.trim()) {
      setError("Add your OpenAI API key above.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scribe", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({ title, attendees, transcript, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setOutput(JSON.stringify(data.result ?? data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200/90">
          Neuron suite · 18
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Scribe Meeting Mind
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Board-ready meeting records: themed narrative, dissent-aware decisions, risk mitigations, and a
          proposed next-agenda — richer than quick minutes.
        </p>
      </header>

      <ApiKeyBar settings={settings} accent="from-indigo-400 to-blue-700" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Meeting title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Attendees hint</span>
            <input
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Transcript</span>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-indigo-400/60"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={run}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-400 to-blue-700 px-4 py-3 text-sm font-semibold text-indigo-950 shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Scribing…" : "Generate board record"}
          </button>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs md:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Record JSON</span>
            {error ? <span className="text-rose-400">Error</span> : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <pre className="flex-1 overflow-auto whitespace-pre-wrap text-zinc-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
