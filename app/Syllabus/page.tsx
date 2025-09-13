"use client";

import { useState } from "react";
import * as chrono from "chrono-node";

// Basic event type
type SyllabusItem = {
  id: string;
  title: string;
  dateStart: Date;
  kind: "reading" | "assignment" | "exam" | "other";
  sourceLine: string;
};

function classifyEvent(line: string): SyllabusItem["kind"] {
  const lower = line.toLowerCase();
  if (lower.includes("exam") || lower.includes("midterm") || lower.includes("final")) return "exam";
  if (lower.includes("due") || lower.includes("submit") || lower.includes("assignment")) return "assignment";
  if (lower.includes("read") || lower.includes("chapter") || lower.includes("pp.")) return "reading";
  return "other";
}

export default function SyllabusPage() {
  const [inputText, setInputText] = useState("");
  const [events, setEvents] = useState<SyllabusItem[]>([]);

  const extractEvents = () => {
    const lines = inputText.split("\n").map((l) => l.trim()).filter(Boolean);

    const newEvents: SyllabusItem[] = [];
    lines.forEach((line, i) => {
      const parsed = chrono.parse(line);
      if (parsed.length > 0) {
        parsed.forEach((result) => {
          const event: SyllabusItem = {
            id: `${i}-${result.index}`,
            title: line.replace(result.text, "").trim() || "Untitled",
            dateStart: result.start.date(),
            kind: classifyEvent(line),
            sourceLine: line,
          };
          newEvents.push(event);
        });
      }
    });

    setEvents(newEvents);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Syllabus → Calendar</h1>

      <textarea
        placeholder="Paste syllabus here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-48 p-3 border border-gray-300 rounded mb-4 text-black"
      />

      <button
        onClick={extractEvents}
        className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
      >
        Create Calendar
      </button>

      <div className="mt-6">
        {events.length > 0 ? (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{ev.title}</p>
                  <p className="text-sm text-gray-600">
                    {ev.dateStart.toDateString()} ({ev.kind})
                  </p>
                </div>
                <span className="text-xs text-gray-400 italic">
                  from: "{ev.sourceLine}"
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-4">
            Paste some text above and click <strong>Extract Events</strong>.
          </p>
        )}
      </div>
    </main>
  );
}
