import { tool } from 'ai';
import { z } from 'zod';
import Exa from 'exa-js';

let exaClient: Exa | null = null;

function getExaClient(): Exa | null {
  if (!process.env.EXA_API_KEY) {
    return null;
  }
  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY);
  }
  return exaClient;
}

const categoryQueries: Record<string, string> = {
  india: 'India news today national politics economy',
  business: 'business finance markets economy news rupee INR stocks',
  technology: 'technology AI tech news startups gadgets',
  sports: 'sports news cricket football IPL Olympics',
  general: 'breaking news today top headlines',
  trending: 'trending news viral topics today',
};

export const newsSearch = tool({
  description: 'Search for latest news articles across different categories. Use this tool to fetch current news for India, Business, Technology, Sports, or any specific topic.',
  inputSchema: z.object({
    category: z.enum(['india', 'business', 'technology', 'sports', 'general', 'trending']).optional()
      .describe('News category to search. Options: india, business, technology, sports, general, trending'),
    topic: z.string().optional()
      .describe('Specific topic to search for news about'),
    count: z.number().min(1).max(10).default(3)
      .describe('Number of news articles to return (1-10)'),
  }),
  execute: async ({ category, topic, count = 3 }) => {
    const exa = getExaClient();
    if (!exa) {
      return { 
        error: true, 
        message: "Sorry, I couldn't fetch news right now. The news service is not available." 
      };
    }
    
    try {
      let searchQuery = '';
      
      if (topic) {
        searchQuery = `${topic} news latest`;
      } else if (category && categoryQueries[category]) {
        searchQuery = categoryQueries[category];
      } else {
        searchQuery = categoryQueries.general;
      }

      const { results } = await exa.search(searchQuery, {
        contents: {
          text: true,
        },
        numResults: count,
        type: 'neural',
      });

      if (!results || results.length === 0) {
        return {
          error: true,
          message: "Sorry, I couldn't find any news articles for that query. Try another category or topic."
        };
      }

      return {
        success: true,
        category: category || 'general',
        topic: topic || null,
        articles: results.map(result => ({
          headline: result.title || 'Untitled',
          url: result.url,
          summary: result.text?.slice(0, 800) || '',
          source: extractSourceName(result.url),
          publishedDate: result.publishedDate || null,
        })),
      };
    } catch (error) {
      console.error('Error searching news:', error);
      return { 
        error: true, 
        message: "Sorry, I couldn't fetch that right now. Try another category or topic." 
      };
    }
  },
});

function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace('www.', '').split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return hostname;
  } catch {
    return 'Unknown Source';
  }
}
