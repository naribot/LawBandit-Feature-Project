"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Issue_Min_Char = 100; 
const Rule_Min_Char = 150;
const Analysis_Min_Char = 350;
const Conclusion_Min_Char = 100;
function IssueCheck(text: string) {
  if (text.trim().length < Issue_Min_Char) return "Issue seems too short.";
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
function wordCount(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
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
  const [isDoneOpen, setIsDoneOpen] = useState(false);



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
          className="p-0 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow mr-40"
        >
          <img src="https://static.vecteezy.com/system/resources/previews/000/366/438/original/home-vector-icon.jpg" alt = "Home icon." className="w-12 h-10 border-2 rounded-1g" ></img>
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
            <span className="text-2xl font-mono bg-white px-4 py-2 rounded shadow text-black">
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
            {/*<button
              onClick={() => downloadMarkdown({ issue, rule, analysis, conclusion })}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
            >
              Export .md file
            </button>

            <button
              onClick={() => spillNotesAsWord({ issue, rule, analysis, conclusion })}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow"
            >
              Export Word
            </button>
             */}

             {/* Thought it was better to add a pop up rather than displaying these buttons on the page*/}
            <button
              onClick={() => setIsDoneOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
            >
              Done
            </button>

            </>
            )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="bg-white border-4 border-grey rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Issue</h2>
          <textarea
            placeholder="State the issue clearly..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="button"
            onClick={() => setIssue("")}
            className="self-end mt-2 px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            Clear
          </button>
          <p className="mt-2 text-sm flex items-center justify-between">
            <span className={issue.trim().length < Issue_Min_Char ? "text-red-600" : "text-green-600"}>
              {IssueCheck(issue)}
            </span>
            <span className="text-gray-500">
              {issue.trim().length}/{Issue_Min_Char} chars • {wordCount(issue)} words
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg border-4 border-grey shadow p-4 flex flex-col relative">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Rule</h2>
          <textarea
            placeholder="Summarize the rule(s)..."
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="button"
            onClick={() => setRule("")}
            className="self-end mt-2 px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            Clear
          </button>
          <p className="mt-2 text-sm text-gray-500">{RuleCheck(rule)}
            <span className="text-gray-500 absolute bottom-2 right-2">
              {rule.trim().length}/{Rule_Min_Char} chars • {wordCount(rule)} words
            </span>
          </p>
        </div>

        <div className="bg-white border-4 border-grey rounded-lg shadow p-4 flex flex-col relative">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Analysis</h2>
          <textarea
            placeholder="Apply the rule to the facts..."
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="button"
            onClick={() => setAnalysis("")}
            className="self-end mt-2 px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            Clear
          </button>
          <p className="mt-2 text-sm text-gray-600">{AnalysisCheck(analysis)}
            <span className=" absolute bottom-2 right-2 text-gray-500">
              {analysis.trim().length}/{Analysis_Min_Char} chars • {wordCount(analysis)} words
            </span>
          </p>
        </div>

        <div className="bg-white border-4 border-grey rounded-lg shadow p-4 flex flex-col relative">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Conclusion</h2>
          <textarea
            placeholder="Wrap it up..."
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            type="button"
            onClick={() => setConclusion("")}
            className="self-end mt-2 px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            Clear
          </button>

          <p className="mt-2 text-sm text-gray-600">{ConclusionCheck(conclusion)}
            <span className="absolute bottom-2 right-2 text-gray-500">
              {conclusion.trim().length}/{Conclusion_Min_Char} chars • {wordCount(conclusion)} words
            </span>
          </p>
        </div>
      </section>
      {isDoneOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsDoneOpen(false)}  
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} 
          >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Export your IRAC as a file
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Choose format to download your draft.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsDoneOpen(false)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                downloadMarkdown({ issue, rule, analysis, conclusion });
                setIsDoneOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Download .md
            </button>
            <button
              onClick={() => {
                spillNotesAsWord({ issue, rule, analysis, conclusion });
                setIsDoneOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Download .docx
            </button>
          </div>
        </div>
      </div>
    )}
    </main>
  );
}
