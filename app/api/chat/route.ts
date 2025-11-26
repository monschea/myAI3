import { streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { MODEL } from '@/config';
import { SYSTEM_PROMPT } from '@/prompts';
import { isContentFlagged } from '@/lib/moderation';
import { webSearch } from './tools/web-search';
import { pokemonLookup, pokemonBattleAnalysis } from './tools/pokemon-lookup';
import { pokedexLookup } from './tools/pokedex';

export const maxDuration = 30;

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    parts?: Array<{ type: string; text?: string }>;
}

function getMessageText(message: ChatMessage): string {
    if (message.parts && Array.isArray(message.parts)) {
        return message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text || '')
            .join('');
    }
    return message.content || '';
}

function convertMessages(messages: ChatMessage[]): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    return messages.map(msg => ({
        role: msg.role,
        content: getMessageText(msg)
    })).filter(msg => msg.content.length > 0);
}

export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return new Response('Invalid messages format', { status: 400 });
    }

    const latestUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();

    if (latestUserMessage) {
        const textContent = getMessageText(latestUserMessage);

        if (textContent) {
            const moderationResult = await isContentFlagged(textContent);

            if (moderationResult.flagged) {
                const stream = createUIMessageStream({
                    execute({ writer }) {
                        const textId = 'moderation-denial-text';

                        writer.write({ type: 'start' });
                        writer.write({ type: 'text-start', id: textId });
                        writer.write({
                            type: 'text-delta',
                            id: textId,
                            delta: moderationResult.denialMessage || "Your message violates our guidelines.",
                        });
                        writer.write({ type: 'text-end', id: textId });
                        writer.write({ type: 'finish' });
                    },
                });

                return createUIMessageStreamResponse({ stream });
            }
        }
    }

    const convertedMessages = convertMessages(messages);

    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
        messages: convertedMessages,
        tools: {
            webSearch,
            pokemonLookup,
            pokemonBattleAnalysis,
            pokedexLookup,
        },
        maxSteps: 10,
    });

    return result.toUIMessageStreamResponse();
}
