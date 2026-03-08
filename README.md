# Green Shelf

Green Shelf is an intelligent inventory and waste reduction tracking application built with Next.js, Convex, and AI integrations.

**Live Demo:** [https://green-shelf-panw.vercel.app/](https://green-shelf-panw.vercel.app/)

## Quick Start Guide

### Prerequisites
Before you begin, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* An [OpenRouter API Key](https://openrouter.ai/) for generating AI Waste Insights.

### Run Commands

**1. Install dependencies:**
```bash
npm install
```

**2. Set up environment variables:**
Create a `.env.local` file in the root directory and add your OpenRouter API key:
```env
OPENROUTER_API_KEY="your_api_key_here"
```

**3. Start the backend database (Convex):**
In a dedicated terminal window, run the Convex dev server to sync your schema and functions:
```bash
npx convex dev
```

**4. Start the frontend application:**
In a separate terminal window, start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### Test Commands

The project uses [Vitest](https://vitest.dev/) for unit testing utility functions and components.

**Run the test suite:**
```bash
npm run test
```

**Run the test suite in watch mode (for active development):**
```bash
npm run test:watch
```

*(Optional) Seed Mock Data:* To test the UI and AI integration quickly, navigate to the **Settings** page (`/settings`) in your browser and click the **Seed Mock Data** button under Developer Tools. This will inject realistic inventory and impact history logs into your database instantly.
