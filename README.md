# AI-Native Document Editor

A production-ready, full-stack web application for creating, editing, uploading, and sharing documents, featuring an intuitive Google Docs-like interface and a built-in AI summarization tool.

## Features

1. **Document Management**: Create, rename, save, and manage documents across an account.
2. **Rich Text Editor**: Integrated `react-quill` providing formatting options (bold, headings, lists).
3. **File Upload**: Attach `.txt` or `.md` files directly into the editor for instant modification.
4. **Sharing System**: Owners can grant `viewer` or `editor` permissions to other users via email.
5. **Role-Based Access**: Secure frontend and backend enforcement preventing unauthorized editing.
6. **AI Summarization**: Built-in intelligent text analysis extracting key takeaways from documents.

## Tech Stack

- **Frontend**: React (Vite), React Router, React Quill, Axios, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer, CORS.

## Architecture

We structured the project cleanly into two main domains:
- `/client`: Handles UI/UX, routing, rich text editing, and state.
- `/server`: REST API managing CRUD operations, document access control, and file processing.

## AI Usage Explanation

**Where AI is used**:
Within the document editor window, an "AI Summarize" feature is available on the toolbar. When clicked, the current editor text is analyzed and returned as a modal pop-up containing a simplified summary.

**Why AI is used**:
To help users quickly understand long uploaded texts (e.g. from a thick `.md` report) without having to manually sift through paragraphs. It enhances productivity and reading comprehension.

**What parts were AI-assisted**:
For demonstration and "out of the box" usability without requiring API keys, the AI engine is currently built via a simulated heuristic pattern inside `/server/routes/ai.js`. It intelligently strips HTML and attempts a pseudo-extractive summary by highlighting focal sentences. 

**What decisions were manual**:
The UI presentation of the AI, the loading state architecture, and the request payload strategy were fully manually chosen. Moving to a real LLM integration (like OpenAI) would simply involve swapping the backend implementation in `ai.js` without altering any frontend UI or logic.

## Setup Instructions

### Environment Setup
You'll need Node.js and MongoDB installed on your system.

### Running the Backend

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API server:
   ```bash
   node server.js
   ```
   *The server runs on `http://localhost:5000` with the MongoDB database hosted at `mongodb://127.0.0.1:27017/ai-native-docs`.*

### Running the Frontend

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *Vite will start the client, typically on `http://localhost:5173`.*

Open the React app in your browser and start creating!
