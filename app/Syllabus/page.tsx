"use client";

import { useState } from "react";
import * as chrono from "chrono-node";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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

  const resetAll = () => {
    setInputText("");
    setEvents([]);
  };

  return (
    <main className="min-h-screen bg-gray-200 p-8 flex flex-col items-center justify-center">
        <head>
            <title>Syllabus converter</title>
        </head>
      {events.length === 0 ? (

  <div className="text-center max-w-3xl w-full -mt-110 border-10 bg-white p-11 border-grey-400"> 
    <h1 className="text-5xl font-extrabold text-blue-900 mb-30 tracking-tight">
      Syllabus → Calendar Converter
    </h1>

    <textarea
      placeholder="Paste syllabus here..."
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      className="w-full h-56 p-4 border-10 border-gray-200 rounded mb-6 text-lg text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />

    <div className="flex gap-4 justify-center">
      <button
        onClick={extractEvents}
        className="px-6 py-3 bg-indigo-600 mt-20 text-white text-lg font-semibold rounded-lg shadow hover:bg-indigo-700"
      >
        Extract Events
      </button>
      <button
        onClick={resetAll}
        className="px-6 py-3 bg-red-600 mt-20 text-white text-lg font-semibold rounded-lg shadow hover:bg-red-700"
      >
        Reset
      </button>
    </div>
  </div>
  
) : (

        // After extraction
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Extracted Events
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() =>
                setEvents((prev) =>
                  prev.map((ev) => ({
                    ...ev,
                    dateStart: new Date(ev.dateStart.getTime() + 1 * 86400000),
                  }))
                )
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
              Shift +1 day
            </button>
            <button
              onClick={() =>
                setEvents((prev) =>
                  prev.map((ev) => ({
                    ...ev,
                    dateStart: new Date(ev.dateStart.getTime() - 1 * 86400000),
                  }))
                )
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
              Shift -1 day
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>

          <ul className="space-y-3">
            {events.map((ev) => (
              <li key={ev.id} className="bg-white p-4 rounded shadow space-y-2">
                <input
                  type="text"
                  value={ev.title}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x) =>
                        x.id === ev.id ? { ...x, title: e.target.value } : x
                      )
                    )
                  }
                  className="font-semibold text-gray-800 w-full border-b border-gray-200"
                />
                <input
                  type="date"
                  value={ev.dateStart.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x) =>
                        x.id === ev.id
                          ? { ...x, dateStart: new Date(e.target.value) }
                          : x
                      )
                    )
                  }
                  className="border rounded px-2 py-1 text-gray-700"
                />
                <select
                  value={ev.kind}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((x) =>
                        x.id === ev.id
                          ? { ...x, kind: e.target.value as SyllabusItem["kind"] }
                          : x
                      )
                    )
                  }
                  className="ml-2 border rounded px-2 py-1 text-gray-700"
                >
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="reading">Reading</option>
                  <option value="other">Other</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
