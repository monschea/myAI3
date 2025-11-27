import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";
import { wrapLanguageModel, extractReasoningMiddleware } from "ai";

export const MODEL = openai("gpt-4.1");

// If you want to use a Fireworks model, uncomment the following code and set the FIREWORKS_API_KEY in Vercel
// NOTE: Use middleware when the reasoning tag is different than think. (Use ChatGPT to help you understand the middleware)
// export const MODEL = wrapLanguageModel({
//     model: fireworks('fireworks/deepseek-r1-0528'),
//     middleware: extractReasoningMiddleware({ tagName: 'think' }), // Use this only when using Deepseek
// });

function getDateAndTime(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    });
    return `The day today is ${dateStr} and the time right now is ${timeStr}.`;
}

export const DATE_AND_TIME = getDateAndTime();

export const AI_NAME = "Pokémon Battle Assistant";
export const OWNER_NAME = "Mansha Kohli";

export const WELCOME_MESSAGE = `Welcome, Trainer! I'm your AI-powered Pokémon Battle Assistant. I can help you with:

⚡ **Type matchups** - Learn what's super effective against what
⚔️ **Battle strategies** - Get competitive advice for any Pokémon
🔄 **Team building** - Build balanced teams with good synergy
📊 **Pokémon stats & moves** - Detailed info on any Pokémon
🌟 **Competitive tiers** - OU, UU, and more

Try asking: "What are Charizard's weaknesses?" or "Build me a team around Garchomp"`;

export const CLEAR_CHAT_TEXT = "New";

export const POKEMON_TYPES = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
] as const;

export const TYPE_COLORS: Record<string, string> = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};

export const MODERATION_DENIAL_MESSAGE_SEXUAL =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_SEXUAL_MINORS =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_HARASSMENT_THREATENING =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_HATE =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_HATE_THREATENING =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_ILLICIT_VIOLENT =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INTENT =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_SELF_HARM_INSTRUCTIONS =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_VIOLENCE_GRAPHIC =
    "Sorry, I can't help with that.";
export const MODERATION_DENIAL_MESSAGE_DEFAULT =
    "Sorry, I can't help with that.";

export const PINECONE_TOP_K = 40;
export const PINECONE_INDEX_NAME = "my-ai";
