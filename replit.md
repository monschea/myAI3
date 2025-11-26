# Pokémon Battle Assistant - Replit Configuration

## Overview
Pokémon Battle Assistant is an AI-powered Pokémon strategist built with Next.js 16, featuring:
- Full type effectiveness matrix (18×18 types, 0×/¼×/½×/1×/2×/4× multipliers)
- Comprehensive Pokédex with stats, abilities, evolutions, and lore
- Regional forms (Alolan, Galarian, Hisuian, Paldean)
- Mega Evolutions and Gigantamax forms
- Competitive tier information (OU, UU, Uber, etc.)
- Battle strategy recommendations

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
│   └── tools/             # AI tools
│       ├── pokemon-lookup.ts  # Type matchups, abilities
│       ├── pokedex.ts         # Pokémon info, evolutions
│       └── web-search.ts      # General web search
├── page.tsx               # Main chat interface
├── explore/               # Pokémon discovery page
│   └── page.tsx           # Generations, Types, Mega Forms, Lore
└── parts/                 # UI components

components/
├── ai-elements/           # AI-specific UI components
├── messages/              # Message display components
│   └── tool-call.tsx      # Tool call visualization
└── ui/                    # Reusable UI components (Radix)

data/pokemon/              # Pokémon data files
├── type-chart.json        # 18×18 type effectiveness matrix
├── abilities.json         # 250+ abilities with effects
├── pokedex.json          # Curated competitive Pokémon
└── regional-forms.json    # Regional forms & Mega Evolutions

lib/
├── pokemon/
│   └── data.ts           # Type lookups, battle calculations
├── moderation.ts         # OpenAI content moderation
└── utils.ts              # Utilities

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
**Required:**
- `OPENAI_API_KEY`: Required for AI model and content moderation

### Next.js Configuration for Replit
The `next.config.ts` has been configured to work with Replit's proxy setup:
- `allowedDevOrigins`: Configured for `*.replit.dev` and `*.pike.replit.dev`
- `experimental.serverActions.allowedOrigins`: Set to allow all origins (`*`)

## Pokémon Battle Assistant Features

### AI Tools

#### pokemonLookup
- Type matchup calculations (e.g., "Is Fire effective against Steel?")
- Defensive profiles (weaknesses, resistances, immunities)
- Offensive coverage analysis
- Ability information lookup

#### pokedexLookup
- Detailed Pokémon info (stats, abilities, evolution, lore)
- Regional form comparisons
- Mega Evolution details
- Pokémon comparisons
- Battle strategy recommendations

#### pokemonBattleAnalysis
- Matchup analysis with strategic recommendations
- Team weakness analysis
- Move coverage checking

### Type Effectiveness Reference
- **4× damage**: Dual-type with shared weakness
- **2× damage**: Super effective
- **1× damage**: Normal effectiveness
- **½× damage**: Not very effective
- **¼× damage**: Dual-type with shared resistance
- **0× damage**: Immunity

### Key Immunities
| Type | Immune To |
|------|-----------|
| Ghost | Normal, Fighting |
| Dark | Psychic |
| Steel | Poison |
| Fairy | Dragon |
| Ground | Electric (via Levitate ability) |
| Flying | Ground |

### Explore Page Categories
1. **Generations** - Browse Pokémon by region (Kanto → Paldea)
2. **Types** - All 18 types with matchup queries
3. **Featured** - Popular competitive Pokémon
4. **Mega Forms** - Mega Evolutions with abilities
5. **Lore** - Legendary, Mythical, Regional Forms info

## Customization

### Quick Customization (No Technical Knowledge Required)
Edit these two files to customize the AI assistant:

1. **`config.ts`** - Change identity, messages, and settings:
   - `AI_NAME`: Name of your AI assistant
   - `OWNER_NAME`: Your name
   - `WELCOME_MESSAGE`: Greeting message
   - `MODEL`: AI model to use

2. **`prompts.ts`** - Change AI behavior:
   - Identity prompt
   - Tool calling instructions
   - Response format guidelines

### Current Configuration
- **AI Name**: Pokémon Battle Assistant
- **Owner**: Mansha Kohli
- **Model**: OpenAI o4-mini
- **Theme**: Red/Orange Pokémon-inspired UI

## Development

### Running Locally
The workflow is pre-configured. Changes to the code will automatically trigger hot reload.

### Key Features
1. **Content Moderation**: All user messages checked for inappropriate content
2. **Type Calculations**: Accurate 18×18 type effectiveness matrix
3. **Competitive Data**: Tier information, roles, and strategy notes
4. **Streaming**: Responses stream in real-time for better UX

## Architecture

### Data Layer
- **type-chart.json**: Complete type effectiveness with colors
- **abilities.json**: 250+ abilities with competitive ratings
- **pokedex.json**: Curated Pokémon with full competitive data
- **regional-forms.json**: All regional variants + Mega/Gigantamax

### Important Files
- `app/api/chat/route.ts`: Chat logic with Pokémon tools
- `lib/pokemon/data.ts`: Type lookups and calculations
- `app/explore/page.tsx`: Interactive discovery UI
- `config.ts` & `prompts.ts`: Easy customization points

## Recent Changes
- 2025-11-26: Built Pokémon Battle Assistant
  - Created comprehensive Pokémon data files
  - Built type effectiveness calculation library
  - Implemented AI tools for lookups and battle analysis
  - Created interactive Explore page with 5 categories
  - Updated branding to Pokémon theme (red/orange)

## Deployment

### For Production Deployment
1. Configure deployment settings using the deployment configuration
2. Set environment variables in production:
   - `OPENAI_API_KEY` (required)
3. Build command: `npm run build`
4. Start command: `npm start`

## Notes
- Pokémon data is curated from official sources for competitive accuracy
- Type calculations follow official game mechanics
- Competitive tiers are based on Smogon guidelines
- Chat history is stored in browser localStorage
