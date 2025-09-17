"use client";

import { useState } from "react";
import * as chrono from "chrono-node";
import { Inter } from "next/font/google";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createEvents } from "ics";

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
  const [view, setView] = useState<"list" | "calendar">("list");

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

  const exportICS = () => {
    const icsEvents = events.map((ev) => ({
      title: ev.title,
      start: [
        ev.dateStart.getFullYear(),
        ev.dateStart.getMonth() + 1,
        ev.dateStart.getDate(),
        ev.dateStart.getHours(),
        ev.dateStart.getMinutes(),
      ],
      duration: { hours: 1 },
    }));

    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }
      const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "syllabus-events.ics";
      a.click();
    });
  };

  return (
    <main className="min-h-screen bg-gray-200 p-8 flex flex-col items-center justify-center">
      <head>
        <title>Syllabus converter</title>
      </head>
 
      {events.length === 0 ? (
        // Initial screen
        <div className="text-center max-w-3xl w-full -mt-110 border-8 br-20 bg-white p-11 rounded 1g border-indigo-800 ">
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
              className="px-6 py-3 bg-indigo-900 mt-20 text-white mr-20 text-lg font-semibold rounded-lg shadow hover:bg-indigo-700"
            >
              Extract Events
            </button>
            <button
              onClick={resetAll}
              className="px-2 py-2 bg-grey-600 mt-20 text-white text-lg font-semibold rounded-lg shadow hover:bg-red-700"
            >
              <img src="https://t4.ftcdn.net/jpg/05/30/25/61/360_F_530256108_XvKrhRPnlUYkK8PZhEiEDyS8zanyTJjc.jpg" alt="A pink eraser." className="w-15 h-10 border-2 rounded-1g"></img>
            </button>
          </div>
        </div>
      ) : (
        // After extraction
        <div className="w-full max-w-3xl border-blue-900 border-7 p-5 bg-white mb-50">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-10 ml-50">
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
              className="px-3 py-1 bg-gray-500 border-2 border-black rounded hover:bg-gray-300 text-white"
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
              className="px-3 py-1 bg-gray-500 border-2 border-black rounded hover:bg-gray-300 text-white"
            >
              Shift -1 day
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1 bg-red-600 border-3 border-black text-white rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>

          {/* to view toggle buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded border-2 border-black ${view === "list" ? "bg-indigo-600 text-white" : "bg-indigo-300"}`}
            >
              List View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1 rounded border-2 border-black ${view === "calendar" ? "bg-indigo-600 text-white" : "bg-indigo-300"}`}
            >
              Calendar View
            </button>
            <button
              onClick={exportICS}
              className="px-3 py-1 bg-green-600 border-2 border-black text-white rounded hover:bg-green-700"
            >
              Export .ics
            </button>
          </div>

          {view === "list" ? (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className=" border-4 border-blue-900 p-4 rounded shadow space-y-2">
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
          ) : (
            <div className="bg-gray-300 p-4 rounded shadow text-black border-5 border-indigo-900 flex items-center justify-center mr-30 ml-30 ">
              <Calendar
                value={new Date()}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const todaysEvents = events.filter(
                      (ev) =>
                        ev.dateStart.getFullYear() === date.getFullYear() &&
                        ev.dateStart.getMonth() === date.getMonth() &&
                        ev.dateStart.getDate() === date.getDate()
                    );
                    return (
                      <ul className="text-xs text-blue-600">
                        {todaysEvents.map((ev) => (
                          <li key={ev.id}>{ev.title}</li>
                        ))}
                      </ul>
                    );
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
