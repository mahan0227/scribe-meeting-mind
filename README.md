# Scribe Meeting Mind

Produce a **board-ready meeting record** from a transcript: themed narrative, dissent-aware decisions, risks with mitigations and owners, parking lot, and suggested next-meeting prep—richer than quick minutes (see **Echo Meeting Mind** for a lighter distillation).

## What it is

A BYOK Next.js app that treats meetings as **governance artifacts**: not just bullets, but narrative context, explicit disagreement, and operational follow-through fields in JSON.

## Why it’s useful

- Gives **execs and boards** a single readable artifact without hiring a professional scribe every time.
- Preserves **why** a decision was made and what was **not** decided.
- Links **risks** to owners and mitigations—not generic “we should be careful.”
- Seeds **next agenda** so recurring meetings compound instead of reset.

## Where you can use it

- **Boards & committees** — monthly reviews, compensation, audit, risk committees.
- **Incident command** — postmortem narrative with decisions and dissent.
- **Program management** — steering committees with multiple stakeholders.
- **Legal / compliance-heavy** shops where a paper trail matters (still not legal advice).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/scribe` · Header `Authorization: Bearer <key>`

Body: `transcript` (required), optional `title`, `attendees`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
