**Candidate Name:** Rhea Kaithal  

**Scenario Chosen:** AI-Powered "Green-Tech" Inventory Assistant  

**Estimated Time Spent:** ~6 hours  

Presentation: https://youtu.be/HW9wiE_2wAY

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

## **Sample JSON File can be found under libs/seedData**

## AI Disclosure
● Did you use an AI assistant (Copilot, ChatGPT, etc.)? (Yes/No)  

Yes.  

I applied AI to develop this tool by first using Google Stitch (AI tool for quick frontend design) to create frontend design mockups. Then I exported those screens to Antigravity IDE (Google’s AI IDE) to use agentic AI workflow to convert into a full React app. Then added the Backend components (Convex), debugging with Antigravity inline agent tool. I lastly implemented robust testing by asking the Antigravity Developer AI Agent to generate test cases for security and input validation.   


● How did you verify the suggestions?  

I tested the code iteratively through unit testing and manually testing locally in the dev environment. I confirmed API interactions through runtime testing and console logs. 

● Give one example of a suggestion you rejected or changed:  

I rejected the suggestion to store AI-generated insights into the database with every item update. I opted out of this to avoid unneccessary database writes. 

## Tradeoffs
I chose to not include the following features to maintain within the allotted timeframe:  

- User logins/Independent accounts
- Real-time/Push Notifications for Expiration
I instead focused on create,view,update,search features and incorporating effective AI tools into the app.


If I had more time for developing this tool, I would build authentication for independent users so that the database can identify source of requests. This would ensure greater safety for the database and allow customer scaling.

The known limitations of GreenShelf is that it does not allow multi-user isolated inventory tracking yet. It is acting as a single-tenant, shared user organization tool. Also key AI features depend on external LLM providers via OpenRouter. Network latency or provider outages could temporarily degrade AI functionality, though manual inventory entry remains available as a fallback. Some historical analytics are computed dynamically in the client. As historical logs grow, this could introduce performance bottlenecks without additional backend aggregation. 
