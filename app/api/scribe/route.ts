import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: {
    transcript?: string;
    title?: string;
    attendees?: string;
    model?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.transcript?.trim()) {
    return NextResponse.json({ error: "`transcript` is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";

  const system = `You are Scribe Meeting Mind — produce board-ready meeting records (richer than quick minutes).
Return JSON:
- title: string
- attendees_inferred: string[]
- agenda: { item: string; status: "discussed"|"deferred"|"skipped" }[]
- narrative: string // markdown, chronological but grouped by theme
- decisions: { decision: string; rationale: string; dissent: string }[]
- actions: { task: string; owner: string; due: string; priority: "P0"|"P1"|"P2" }[]
- risks: { risk: string; mitigation: string; owner: string }[]
- parking_lot: string[]
- next_meeting: { proposed_topics: string[]; prep: string[] }`;

  const user = `MEETING_TITLE:\n${body.title?.trim() || "Untitled"}\nATTENDEES_HINT:\n${body.attendees?.trim() || "infer from transcript"}\n\nTRANSCRIPT:\n---\n${body.transcript}\n---`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
