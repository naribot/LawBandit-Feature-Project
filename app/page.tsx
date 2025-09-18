"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showCards, setShowCards] = useState(false);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-indigo-900 -mt-4 mb-15 ml-10">
          LawBandit
        </h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            type="button"
            onClick={() => setShowCards((s) => !s)}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            aria-expanded={showCards}
            aria-controls="tool-cards"
          >
            Click to Choose between the two Pages
          </button>

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nodejs.org/en/learn/typescript/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            Typescript + Node.js apps
          </a>
        </div>

        {showCards && (
          <div
            id="tool-cards"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl animate-[fadeIn_200ms_ease-out]"
          >
            <Link
              href="/irac"
              className="block p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-bold mb-2 text-black">IRAC Coach</h2>
              <p className="text-gray-600">
                Practice structuring legal analysis with real-time feedback.
              </p>
            </Link>

            <Link
              href="/Syllabus"
              className="block p-6 text-center bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-bold mb-2 text-indigo-900">Syllabus converter</h2>
              <p className="text-gray-600">
                Convert your syllabus into a well structured Calendar
              </p>
            </Link>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.lawbandit.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to LawBandit Website →
        </a>
      </footer>
    </div>
  );
}
