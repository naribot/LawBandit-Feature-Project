## I decided to implement 2 tools/pages, each with different functions. 

1. IRAC (Issue, Rule, Analysis, Conclusion) Coach – This tool lets you practice writing out legal analysis (Issue, Rule, Analysis, Conclusion) with some extra features like word count, character count, and a done button that exports your work.
2. Syllabus to Calendar – I went with an approach a little different than suggested at first by letting you paste or upload your syllabus and automatically turning important dates (assignments, exams, readings) into a structured calendar that you can download as an .ics file. Later added an LLM (OpenAI) to read pdf files upon using the upload button via API calls.


		 Setting Up

1. Cloned the repo to my local folder after initializing git
2. I installed dependencies(“npm install”), to allow me to use the npm command for installing many of the other dependencies like openAI …
3. Set up environment variables, like my OpenAI key.
4. Use npm run dev to run servers on localhost port 3000
5. Deploy it to Vercel

		Features
Starting this project, The Idea was to build small but useful tools for any lawstudents that would seamlessly flow good with the LawBandit website.

For IRAC Coach:

I wanted something that could help me structure answers in the IRAC format. I added features step by step, first just the text boxes, then character/word counters, and finally a “Done” button that makes exporting simple. Instead of having multiple download buttons cluttering the page, the Done button pops up an option to save as Markdown or Word. After doing some research, I found that legal writing as a huge part of law students’ education and practice. This insight gave me the idea to build this tool, which helps users practice structuring their legal while mimicking the timing and word count pressures of law school exams, while keeping the tool clean and practical. This is just an MVP that could be built up on, like adding a customizable timer, or LLM powered suggestions to improve their Writing, All possible with more time and budget allocations.

For Syllabus Converter:
My first version only worked if I pasted text from the syllabus and used a date-parsing library. It worked okay for plain text, but not for PDFs with tables. To fix that, I added an API route that sends the syllabus text to a OpenAI LLM, which then returns all the important dates in JSON format. This way, uploading a syllabus PDF now works just as well as pasting plain text. I also included different ways to view the syllabus as list view and calendar view. The List View lets the user customize each item by choosing its type (reading, assignment, exam, or other) before exporting everything as an .ics file, which can then be imported into Google Calendar. The Calendar View simplifies things further by visually displaying all events in a monthly calendar layout, powered by the react-calendar library. With more time, its possible to modify the button to directly import the .ics file into google calendar using their API.

For Landing Page:

•	Replaced the default Next.js template with a custom homepage.
•	Added Central button that reveals tool options (/irac and /syllabus) with links to both pages
•	Footer links back to the main LawBandit website.






This was very fun, Thank you for the opportunity!

