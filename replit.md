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
6. **Pokémon RAG System**: Comprehensive Pokémon battle strategy assistant

## Pokémon RAG System

### Overview
The assistant includes a comprehensive Pokémon RAG (Retrieval-Augmented Generation) system with:
- Complete Pokédex with stats, abilities, lore, and competitive tiers
- Type effectiveness calculations for all 18 types
- Regional forms: Alolan, Galarian, Hisuian, Paldean variants
- Mega Evolution data for all Mega-capable Pokémon
- Gigantamax forms and G-Max moves
- Terastallization mechanics
- Dual-type matchup analysis
- Battle strategy generation for specific Pokémon
- Ability synergies and hidden abilities
- Priority move reference
- Speed control mechanics
- Weather and terrain synergies

### Pokémon Data Files
```
data/pokemon/
├── pokedex.json           # Comprehensive Pokémon database (50+ entries)
├── regional-forms.json    # All regional variants + Mega/Gigantamax/Tera info
├── type-chart.json        # Complete 18x18 type effectiveness matrix
├── priority-moves.json    # Priority moves by tier (+5 to -7)
├── ability-synergies.json # Weather, terrain, offensive, defensive abilities

lib/pokemon/
├── types.ts               # Type effectiveness calculations
├── data.ts                # Pokédex, ability, and move data utilities
└── index.ts               # Main lookup functions

app/api/chat/tools/
├── pokemon-lookup.ts      # Type matchup and battle analysis tools
└── pokedex.ts             # Pokédex RAG tool
```

### Pokémon Tools

1. **pokedexLookup** - RAG-powered Pokédex for comprehensive information:
   - `pokemon_info`: Full Pokédex entry (stats, abilities, evolution, lore)
   - `regional_forms`: Regional variant information
   - `battle_strategy`: Role analysis, counters, priority moves
   - `mega_evolutions`: Mega Evolution list and mechanics
   - `gigantamax`: Gigantamax forms and G-Max moves
   - `terastallization`: Tera mechanics and competitive notes
   - `evolution_chain`: Full evolution chain with methods
   - `compare_pokemon`: Side-by-side comparison of two Pokémon

2. **pokemonLookup** - Fast deterministic queries:
   - `type_matchup`: Calculate effectiveness between types
   - `counters`: Find best types to beat a Pokémon
   - `defensive_profile`: Get weaknesses, resistances, immunities
   - `ability`: Look up ability effects and synergies
   - `priority_moves`: Get priority move options by type
   - `speed_control`: List speed control options

3. **pokemonBattleAnalysis** - Strategic battle analysis:
   - Full matchup breakdown
   - Counter recommendations
   - Strategic tips for singles/doubles
   - Ability considerations

### Example Queries
- "Tell me about Charizard" (Pokédex entry with all info)
- "What is Alolan Ninetales?" (Regional form info)
- "How do I use Garchomp in battle?" (Battle strategy)
- "Compare Charizard and Blastoise" (Side-by-side comparison)
- "What beats Dragon/Flying?" (Type counters)
- "Is Fire effective against Steel?" (Quick matchup check)
- "What are the Mega Evolutions?" (Mega list and mechanics)
- "Tell me about Gigantamax" (Gigantamax info)
- "What priority moves are there for Water type?" (Priority moves)

### Pokémon in Database
Includes popular Pokémon from all generations:
- Gen 1: Venusaur, Charizard, Blastoise, Pikachu, Dragonite, Mewtwo, Mew, Gengar, Gyarados
- Gen 2: Tyranitar, Umbreon, Espeon, Scizor
- Gen 3: Blaziken, Salamence, Metagross
- Gen 4: Garchomp, Lucario, Heatran, Rotom, Weavile
- Gen 5: Excadrill, Volcarona, Ferrothorn, Landorus
- Gen 6: Greninja, Aegislash, Sylveon
- Gen 7: Mimikyu, Toxapex
- Gen 8: Dragapult, Cinderace, Zacian
- Gen 9: Koraidon, Miraidon

### Regional Forms Available
- **Alolan**: Raichu, Sandshrew, Sandslash, Vulpix, Ninetales, Exeggutor, Marowak, etc.
- **Galarian**: Ponyta, Rapidash, Slowpoke, Slowbro, Weezing, Darmanitan, Articuno, Zapdos, Moltres
- **Hisuian**: Growlithe, Arcanine, Typhlosion, Samurott, Zorua, Zoroark, Braviary, Goodra, Decidueye
- **Paldean**: Wooper, Tauros (Combat, Blaze, Aqua breeds)

### Type Effectiveness Reference
- **4x damage**: Dual-type double weakness
- **2x damage**: Super effective
- **1x damage**: Normal effectiveness
- **0.5x damage**: Not very effective
- **0.25x damage**: Dual-type double resistance
- **0x damage**: Immune

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
- 2025-11-26: Enhanced Pokémon RAG System with comprehensive Pokédex
  - Added pokedex.json with 40+ Pokémon entries (stats, abilities, lore, evolutions)
  - Added regional-forms.json with Alolan, Galarian, Hisuian, Paldean variants
  - Added Mega Evolution, Gigantamax, and Terastallization data
  - Created pokedexLookup tool for RAG queries (pokemon_info, regional_forms, battle_strategy, compare_pokemon, etc.)
  - Enhanced system prompts with detailed tool usage guidelines
  - Added battle strategy generation for specific Pokémon
  - Added Pokémon comparison functionality

- 2025-11-26: Added Pokémon RAG System
  - Created comprehensive type effectiveness matrix (18 types)
  - Built priority moves database with all tiers (+5 to -7)
  - Added ability synergies (weather, terrain, offensive, defensive, speed)
  - Implemented pokemonLookup and pokemonBattleAnalysis tools
  - Updated system prompts with Pokémon expert instructions
  - Added UI support for Pokémon tool displays

- 2025-11-26: Initial Replit setup
  - Configured Next.js to run on port 5000
  - Added Replit-specific proxy configuration
  - Set up workflow for development server
  - Verified dependencies installation
