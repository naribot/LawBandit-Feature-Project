"use client";
import { useState, useEffect } from "react";
import Link from "next/link";


function IssueCheck(text: string) {
  if (text.trim().length < 10) return "Issue seems too short.";
  return "Looks good.";
}
function RuleCheck(text: string) {
  if (!/must|shall/i.test(text)) return "Consider using key legal words (e.g., 'must', 'shall').";
  return "Looks good.";
}
function AnalysisCheck(text: string) {
  if (!/because/i.test(text)) return "Analysis should include reasoning words like 'because'.";
  return "Looks good.";
}
function ConclusionCheck(text: string) {
  if (text.split(".").length < 2) return "Conclusion should be at least one sentence.";
  return "Looks good.";
}
// Markdown export
function downloadMarkdown(data: { issue: string; rule: string; analysis: string; conclusion: string }) {
  const content = `# IRAC Answer

 Issue
${data.issue}

 Rule
${data.rule}

 Analysis
${data.analysis}

 Conclusion
${data.conclusion}
`;

  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "irac.md";
  a.click();
  URL.revokeObjectURL(url);
}

// DOCX export
async function spillNotesAsWord(iracNotes: { issue: string; rule: string; analysis: string; conclusion: string }) {
  const { Document, Packer, Paragraph } = await import("docx");

  
  const combinedText = `${iracNotes.issue} (issue). ${iracNotes.rule} (rule). ${iracNotes.analysis} (analysis). ${iracNotes.conclusion} (conclusion).`;

  const draftDoc = new Document({
    sections: [
      {
        children: [
          new Paragraph(combinedText),
        ],
      },
    ],
  });

  const fileBlob = await Packer.toBlob(draftDoc);
  const link = URL.createObjectURL(fileBlob);
  const anchor = document.createElement("a");
  anchor.href = link;
  anchor.download = "irac-draft.docx";
  anchor.click();
  URL.revokeObjectURL(link);
}




export default function IRACPage() {
  const [issue, setIssue] = useState("");
  const [rule, setRule] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);


  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Autosave
  useEffect(() => {
    localStorage.setItem(
      "irac-data",
      JSON.stringify({ issue, rule, analysis, conclusion })
    );
  }, [issue, rule, analysis, conclusion]);

  // Loading saved data
  useEffect(() => {
    const saved = localStorage.getItem("irac-data");
    if (saved) {
      const { issue, rule, analysis, conclusion } = JSON.parse(saved);
      setIssue(issue);
      setRule(rule);
      setAnalysis(analysis);
      setConclusion(conclusion);
    }
  }, []);

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60).toString().padStart(2, "0");
    const seconds = (t % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <head>
        <title>IRAC Coach</title>
      </head>
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">IRAC Coach</h1>
        <Link
          href="/"
          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
        >
          Home
        </Link>
        <div className="flex items-center gap-4">
            {!showTimer && (
            <button
                onClick={() => {
                setIsRunning(true);
                setShowTimer(true);
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
            Start
            </button>
            )}

            {showTimer && (
            <>
            <span className="text-2xl font-mono bg-white px-4 py-2 rounded shadow">
                {formatTime(time)}
            </span>
            <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow"
            >
                {isRunning ? "Pause" : "Resume"}
            </button>
            <button
                onClick={() => {
                setIsRunning(false);
                setTime(0);
                setShowTimer(false); 
                setIssue("");
                setAnalysis("");
                setConclusion("");
                setRule("");
                }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
            >
                Reset
            </button>
            <button
              onClick={() => downloadMarkdown({ issue, rule, analysis, conclusion })}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Export Markdown
            </button>

            <button
              onClick={() => spillNotesAsWord({ issue, rule, analysis, conclusion })}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
            >
              Export Word
            </button>

            </>
            )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Issue</h2>
          <textarea
            placeholder="State the issue clearly..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <p className="mt-2 text-sm text-gray-600">{IssueCheck(issue)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Rule</h2>
          <textarea
            placeholder="Summarize the rule(s)..."
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <p className="mt-2 text-sm text-gray-600">{RuleCheck(rule)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Analysis</h2>
          <textarea
            placeholder="Apply the rule to the facts..."
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <p className="mt-2 text-sm text-gray-600">{AnalysisCheck(analysis)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Conclusion</h2>
          <textarea
            placeholder="Wrap it up..."
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <p className="mt-2 text-sm text-gray-600">{ConclusionCheck(conclusion)}</p>
        </div>
      </section>
    </main>
  );
}
