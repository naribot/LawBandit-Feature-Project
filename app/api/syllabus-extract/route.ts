import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
You are given syllabus text that may include multiple tasks per date. 
Return EVERY single task, even if multiple share the same date. 
Never merge tasks. Treat each reading, assignment, exam, or oral argument as a separate event. 

Return ONLY valid JSON in this format (inside an "events" array):
{
  "events": [
    { "title": "Reading: Handbook ch 25-28", "date": "2025-01-17", "kind": "reading" },
    { "title": "Assignment: Motion to Dismiss", "date": "2025-01-17", "kind": "assignment" }
  ]
}

Rules:
- Always use ISO format YYYY-MM-DD for "date".
- "kind" must be one of: exam, assignment, reading, other.
- Do not include explanations, only the JSON object.
Syllabus text:
${text}
`;


  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    response_format: { type: "json_object" },
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let events: any[] = [];
  const raw = response.choices[0].message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw);
    events = parsed.events ?? [];
  } catch (err) {
    console.error("Failed to parse JSON:", err);

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        events = JSON.parse(raw.slice(start, end + 1));
      } catch {
        events = [];
      }
    }
  }

  return NextResponse.json(events);
}
