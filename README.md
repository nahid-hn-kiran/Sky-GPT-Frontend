# SkyGPT Frontend

The official web client for **SkyGPT** — an enterprise-grade, multi-agent AI assistant platform. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**, designed around an **Ethereal Sky** dark-mode visual theme with responsive glassmorphism and streaming micro-interactions.

---

## 🌟 Key Features

- **Multi-Agent Mode Switching**:
  - Seamlessly select and query specialized AI agents:
    - ⚡ **Auto (Supervisor)**: Dynamic intent classification and intelligent agent delegation.
    - 💬 **Chat**: Open-ended conversational assistant, general knowledge, and reasoning.
    - 🔍 **Live Search**: Grounded real-time web search powered by Tavily.
    - 💻 **Coding Specialist**: Syntax-highlighted code generation, architectural debugging, and refactoring.
    - 📄 **Document & PDF Analyst**: Automated client-side extraction and semantic RAG retrieval over user documents.
    - 📊 **Slide Deck Architect**: Interactive multi-slide presentation renderer with one-click `.pptx` PowerPoint export.
    - 🎨 **Visual Creator**: Dynamic prompt expansion and image rendering with one-click download and lightbox previews.

- **Multimodal File & Image Workflows**:
  - Drag-and-drop or attachment picker for documents (`.pdf`, `.docx`, `.txt`, `.md`) and images (`.png`, `.jpg`, `.jpeg`, `.webp`).
  - Automatic thread provisioning: Uploading a file before starting a conversation guarantees immediate document chunk indexing to that exact thread.
  - Image Vision: Directly ask questions about attached images with visual thumbnails displayed in the chat thread.

- **Micro-Interactions & Response Actions**:
  - **Copy Response**: One-click clipboard copy with animated visual confirmation.
  - **PDF Export**: Generate downloadable, styled PDF reports on demand powered by `jspdf`.
  - **Slide Deck Export**: Direct client-side `.pptx` download powered by `pptxgenjs`.
  - **Direct Image Download**: Blob-based downloads (`skygpt-image-<timestamp>.jpg`) with fullscreen lightbox preview.

- **Microservice-Aware Client Architecture**:
  - Communicates strictly with the backend **API Gateway (`http://localhost:4000`)**, ensuring zero microservice exposure and zero CORS credential leaks.
  - Automatic session fallback: Supports authenticated user accounts with Better Auth as well as anonymous guest exploration.

---

## 🏗️ Architecture & Folder Structure

```
frontend/
├── src/
│   ├── app/                         # Next.js App Router (Layouts & Global Styles)
│   │   ├── layout.tsx               # Root HTML wrapper, metadata & Provider setup
│   │   ├── page.tsx                 # Main chat interface & hero action cards
│   │   └── globals.css              # Custom Tailwind utilities & glassmorphism theme
│   ├── components/
│   │   ├── chat/                    # Core conversational UI
│   │   │   ├── ChatContainer.tsx    # Message list, empty state & auto-scroll anchor
│   │   │   ├── ChatInput.tsx        # Auto-resizing textarea, file picker & agent router
│   │   │   ├── MessageBubble.tsx    # User & assistant bubbles, action bar (Copy, PDF)
│   │   │   └── AgentSelector.tsx    # Dropdown pill selector for active AI agents
│   │   ├── agent-renderers/         # Custom visual renderers for specialized agent output
│   │   │   ├── CodeBlock.tsx        # Syntax-highlighted code snippets with copy button
│   │   │   ├── ImageCard.tsx        # Visual creator preview, direct download & lightbox
│   │   │   └── SlideDeckCard.tsx    # Interactive slide carousel with .pptx export
│   │   ├── layout/                  # Structural components
│   │   │   ├── Header.tsx           # App navbar, agent indicators & user profile
│   │   │   └── Sidebar.tsx          # Conversation threads history & thread creation
│   │   └── modals/                  # Modals & Dialogs
│   │       ├── LoginModal.tsx       # Auth modal for Better Auth sessions
│   │       └── DocIngestModal.tsx   # Dedicated document parser & status dialog
│   ├── context/                     # Global State Management (React Context)
│   │   ├── AuthContext.tsx          # User credentials, session tokens & guest profile
│   │   ├── ChatContext.tsx          # Active threads, message arrays & agent execution
│   │   └── index.tsx                # Combined Provider root
│   ├── lib/                         # Client Utilities & API Client
│   │   ├── api.ts                   # Gateway REST client (Auth, Conversations, Uploads)
│   │   ├── file-parser.ts           # File type guards, previews & base64 converter
│   │   └── utils.ts                 # Classname merge helper (`clsx` + `tailwind-merge`)
│   └── types/                       # Shared TypeScript interfaces & DTOs
│       └── index.ts                 # Message, Conversation, AgentType definitions
├── public/                          # Static assets & brand icons
├── next.config.ts                   # Next.js configuration & Turbopack settings
├── package.json                     # Frontend dependencies & build scripts
└── tsconfig.json                    # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **npm** or **pnpm**
- Running SkyGPT Backend Gateway (default: `http://localhost:4000`)

### 1. Installation

From the repository root or inside the `frontend` directory:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file inside the `frontend` directory:

```env
# URL of the SkyGPT Backend API Gateway
NEXT_PUBLIC_GATEWAY_URL="http://localhost:4000"
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Production Deployment

To generate an optimized production bundle:

```bash
npm run build
```

To run the compiled production server:

```bash
npm run start
```

### Linting & Type Checking

```bash
# Run ESLint checks
npm run lint

# Run strict TypeScript compilation check
npx tsc --noEmit
```

---

## 📦 Key Technologies & Libraries

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [Marked](https://marked.js.org/)
- **Client Document Exports**:
  - PowerPoint Decks: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)
  - PDF Generation: [jsPDF](https://github.com/parallax/jsPDF)

---

## 🛡️ License

Part of the **SkyGPT** AI Platform. Developed for portfolio and educational demonstrations.
