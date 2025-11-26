# MyAI3 - Replit Configuration

## Overview
This is an AI-powered chatbot assistant built with Next.js 16, featuring:
- Advanced language models (OpenAI o4-mini)
- Web search capabilities (via Exa API)
- Vector database integration (Pinecone)
- Content moderation
- Real-time streaming responses

## Project Setup

### Technology Stack
- **Framework**: Next.js 16.0.0 (App Router with Turbopack)
- **Language**: TypeScript
- **UI Components**: Radix UI + Tailwind CSS v4
- **AI SDK**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/openai)
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Hooks + useChat hook

### File Structure
```
app/
├── api/chat/              # Chat API endpoint
│   ├── route.ts           # Main chat handler
│   └── tools/             # AI tools (web search, vector search)
├── page.tsx               # Main chat interface
├── parts/                 # UI components
└── terms/                 # Terms of Use page

components/
├── ai-elements/           # AI-specific UI components
├── messages/              # Message display components
└── ui/                    # Reusable UI components (Radix)

lib/
├── moderation.ts          # OpenAI content moderation
├── pinecone.ts            # Vector database integration
├── sources.ts             # Citation handling
└── utils.ts               # Utilities

config.ts                  # Main app configuration
prompts.ts                 # AI behavior/prompts
```

## Replit Configuration

### Workflows
- **Next.js Dev Server**: Runs on port 5000 (webview)
  - Command: `npm run dev`
  - Port: 5000
  - Host: 0.0.0.0
  - Output: webview

### Environment Variables Required
The following API keys need to be configured for full functionality:

**Required:**
- `OPENAI_API_KEY`: Required for AI model and content moderation
  - Get from: https://platform.openai.com/api-keys

**Optional (for additional features):**
- `EXA_API_KEY`: Enables web search functionality
  - Get from: https://dashboard.exa.ai/
- `PINECONE_API_KEY`: Enables vector database search
  - Get from: https://app.pinecone.io/
- `FIREWORKS_API_KEY`: Alternative AI provider (optional)

### Next.js Configuration for Replit
The `next.config.ts` has been configured to work with Replit's proxy setup:
- `allowedDevOrigins`: Configured for `*.replit.dev` and `*.pike.replit.dev`
- `experimental.serverActions.allowedOrigins`: Set to allow all origins (`*`)

This ensures the app works correctly within Replit's iframe-based preview.

## Customization

### Quick Customization (No Technical Knowledge Required)
Edit these two files to customize the AI assistant:

1. **`config.ts`** - Change identity, messages, and settings:
   - `AI_NAME`: Name of your AI assistant
   - `OWNER_NAME`: Your name
   - `WELCOME_MESSAGE`: Greeting message
   - `MODEL`: AI model to use
   - Moderation messages
   - Pinecone settings

2. **`prompts.ts`** - Change AI behavior:
   - Identity prompt
   - Tone and style
   - Guardrails (safety rules)
   - Tool calling instructions
   - Citation format

### Current Configuration
- **AI Name**: MyAI3
- **Owner**: Mansha Kohli
- **Model**: OpenAI o4-mini
- **Pinecone Index**: my-ai
- **Web Search Results**: 3 results per query

## Development

### Running Locally
The workflow is pre-configured. Changes to the code will automatically trigger hot reload.

### Key Features
1. **Content Moderation**: All user messages are checked for inappropriate content
2. **Web Search**: AI can search the web for current information
3. **Vector Database**: AI can search a knowledge base stored in Pinecone
4. **Citations**: All responses include proper source citations
5. **Streaming**: Responses stream in real-time for better UX

## Deployment

### For Production Deployment
1. Configure deployment settings using the deployment configuration
2. Set environment variables in production:
   - `OPENAI_API_KEY` (required)
   - `EXA_API_KEY` (optional)
   - `PINECONE_API_KEY` (optional)
3. Build command: `npm run build`
4. Start command: `npm start`

## Notes

### Architecture
- **Frontend**: Server-side rendered React components with client-side interactivity
- **API**: Next.js API route handles chat processing
- **Tools**: AI can autonomously decide when to use web search or vector database
- **Storage**: Chat history is stored in browser localStorage

### Important Files
- `app/api/chat/route.ts`: Main chat logic, moderation, and tool orchestration
- `app/page.tsx`: Chat UI with message history and input
- `lib/moderation.ts`: Content safety checks
- `config.ts` & `prompts.ts`: Easy customization points

### Browser Compatibility
- Modern browsers with localStorage support
- JavaScript required
- Supports real-time streaming

## Recent Changes
- 2024-11-26: Initial Replit setup
  - Configured Next.js to run on port 5000
  - Added Replit-specific proxy configuration
  - Set up workflow for development server
  - Verified dependencies installation
