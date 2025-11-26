# NewsGPT - Replit Configuration

## Overview
NewsGPT is an AI-powered news assistant built with Next.js 16, featuring:
- Real-time news fetching across multiple categories
- Web search capabilities (via Exa API)
- Content moderation
- Concise bullet-point summaries
- Neutral, clear tone

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
│   └── tools/             # AI tools (news search, web search)
│       ├── news-search.ts # News fetching tool
│       └── web-search.ts  # General web search
├── page.tsx               # Main chat interface
├── explore/               # News dashboard page
│   └── page.tsx           # News categories & quick actions
├── parts/                 # UI components
└── terms/                 # Terms of Use page

components/
├── ai-elements/           # AI-specific UI components
├── messages/              # Message display components
└── ui/                    # Reusable UI components (Radix)

lib/
├── moderation.ts          # OpenAI content moderation
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

**Required for News Fetching:**
- `EXA_API_KEY`: Enables news and web search functionality
  - Get from: https://dashboard.exa.ai/

### Next.js Configuration for Replit
The `next.config.ts` has been configured to work with Replit's proxy setup:
- `allowedDevOrigins`: Configured for `*.replit.dev` and `*.pike.replit.dev`
- `experimental.serverActions.allowedOrigins`: Set to allow all origins (`*`)

## NewsGPT Features

### Supported Commands
1. **"Latest news"** → Show top 5 headlines with summaries
2. **"News in [category]"** → Respond with 3 recent updates for that category
   - Categories: India, Business, Technology, Sports
3. **"Search news for [topic]"** → Return 2 summarized articles on that topic
4. **"Daily briefing"** → A 1-minute readable summary of top stories
5. **"Trend report"** → List 3 topics currently trending in news

### News Categories
| Category | Scope |
|----------|-------|
| India | National politics, economy, society, regional news |
| Business | Markets, companies, finance, economy, startups, INR/rupee updates |
| Technology | Tech companies, AI, startups, gadgets, digital trends |
| Sports | Cricket, football, Olympics, IPL, global and Indian sports |

### Output Format
```
📰 **[Headline]**
- Key point 1
- Key point 2
- Key point 3
- Source: [Source Name]
```

## Customization

### Quick Customization (No Technical Knowledge Required)
Edit these two files to customize the AI assistant:

1. **`config.ts`** - Change identity, messages, and settings:
   - `AI_NAME`: Name of your AI assistant (default: NewsGPT)
   - `OWNER_NAME`: Your name
   - `WELCOME_MESSAGE`: Greeting message
   - `MODEL`: AI model to use
   - News category definitions

2. **`prompts.ts`** - Change AI behavior:
   - Identity prompt
   - Tone and style (neutral, concise)
   - News formatting guidelines
   - Tool calling instructions

### Current Configuration
- **AI Name**: NewsGPT
- **Owner**: Mansha Kohli
- **Model**: OpenAI o4-mini
- **News Results**: 3 results per category query

## Development

### Running Locally
The workflow is pre-configured. Changes to the code will automatically trigger hot reload.

### Key Features
1. **Content Moderation**: All user messages are checked for inappropriate content
2. **News Search**: AI fetches real-time news using Exa API
3. **Category Filtering**: Focused news for India, Business, Tech, Sports
4. **Citations**: All responses include source names
5. **Streaming**: Responses stream in real-time for better UX

## Architecture

### News Search Tool
The `newsSearch` tool in `app/api/chat/tools/news-search.ts`:
- Uses Exa API for real-time news fetching
- Supports category filtering (india, business, technology, sports)
- Supports topic-based searches
- Returns structured data: headline, summary, source, URL

### Important Files
- `app/api/chat/route.ts`: Main chat logic, moderation, and tool orchestration
- `app/api/chat/tools/news-search.ts`: News fetching implementation
- `app/page.tsx`: Chat UI with message history and input
- `app/explore/page.tsx`: News dashboard with categories and quick actions
- `lib/moderation.ts`: Content safety checks
- `config.ts` & `prompts.ts`: Easy customization points

### Browser Compatibility
- Modern browsers with localStorage support
- JavaScript required
- Supports real-time streaming

## Recent Changes
- 2025-11-26: Transformed to NewsGPT
  - Complete pivot from Pokémon Battle Assistant to NewsGPT
  - Created newsSearch tool for real-time news fetching
  - Updated prompts and config for news assistant identity
  - Built News Dashboard with category tabs, trending topics, and commands
  - Removed all Pokémon-related code and data files
  - Updated UI branding to NewsGPT theme (dark slate design)
  - Added support for all 5 news commands

## Deployment

### For Production Deployment
1. Configure deployment settings using the deployment configuration
2. Set environment variables in production:
   - `OPENAI_API_KEY` (required)
   - `EXA_API_KEY` (required for news)
3. Build command: `npm run build`
4. Start command: `npm start`

## Notes
- News data is fetched in real-time from various sources via Exa API
- Summaries are generated by AI to be concise (3-5 bullet points)
- The assistant maintains a neutral, non-harsh tone
- Chat history is stored in browser localStorage
