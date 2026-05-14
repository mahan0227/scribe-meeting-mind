# Scribe Meeting Mind

**Board-ready meeting records** from raw transcript: themed narrative, dissent-aware decisions, risks with owners, parking lot, and proposed next-meeting prep — richer than quick minutes (see Echo Meeting Mind for a lighter distillation). **BYO OpenAI API key.**

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## API

`POST /api/scribe` · Header `Authorization: Bearer <key>`

Body: `transcript`, optional `title`, optional `attendees`, optional `model`.

## License

MIT
