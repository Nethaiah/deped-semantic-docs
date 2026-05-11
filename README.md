# Laguna University Semantic Theses Search

A centralized, AI-powered document management and search platform built for the **Research and Development Center of Laguna University**. This system digitizes past theses and research papers (specifically IMRADS and abstracts) from various departments and colleges, allowing students and faculty to search, discover, and interact with academic research using advanced semantic search and AI techniques.

## 🌟 Core Capabilities

- **Semantic Vector Search:** Move beyond basic keyword matching. Users can search for theses based on the _meaning_ and _context_ of their queries.
- **Retrieval-Augmented Generation (RAG):** AI-powered Q&A capabilities that allow users to ask specific questions and get natural language answers grounded strictly in the academic papers stored in the system.
- **Centralized Repository:** A single, easily accessible system for all departments to store and browse past IMRADS and abstracts.
- **Role-Based Access Control:** Delineated access between regular users (students/faculty browsing research) and administrators (R&D staff uploading and managing documents).

## 🚀 Technology Stack

This system is built using a modern, decoupled architecture featuring a robust Next.js frontend/backend and a specialized Python FastAPI machine learning microservice.

### Web Application (Frontend & Application Server)

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router)
- **Authentication & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Vector Database:** **PgVector** (Supabase extension for storing and querying embeddings)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Mobile-first, responsive design)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Security:** Next.js `proxy.ts` middleware combined with Supabase SSR for secure, server-side route protection and token refreshing.

### AI & Machine Learning Backend (Microservice)

- **Framework:** **Python FastAPI**
- **ML Capabilities:** Handles the heavy lifting for all AI features.
- **Models:** Utilizes localized Embedding Models and Transformer Models to convert text into high-dimensional vectors.
- **Functions:**
  - Generates embeddings for newly uploaded theses.
  - Processes user search queries into vectors for PgVector similarity searches.
  - Executes RAG pipelines and handles document Q&A logic.

## 🔐 Architecture & Security

The web application employs a server-rendered security model using Next.js proxy conventions:

1.  **Session Refresh:** The proxy securely refreshes Supabase auth cookies on every request.
2.  **Protected Routes:** Unauthenticated users attempting to access the dashboard or document management areas are redirected.
3.  **Admin-Only Routes:** The proxy verifies the user's role against the database. If a non-admin attempts to access `/upload` or `/manage-document`, the request is silently rewritten to trigger a native `404 Not Found` page, completely hiding the existence of administrative systems from unauthorized accounts.

## Getting Started

### Prerequisites

- Node.js (v20+)
- Python (v3.10+) (For the ML Backend)
- A Supabase project with PgVector enabled.

### 1. Environment Variables

Create a `.env` file in the root of the Next.js project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id # Optional: For social sharing
# (Add your FastAPI backend URL here when deployed)
```

### 2. Install Web Dependencies

```bash
npm install
```

### 3. Run the Web Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

_(Note: The Python FastAPI backend should be running concurrently to serve ML requests like embedding generation and RAG queries)._


