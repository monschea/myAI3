import { streamText } from 'ai';
import { MODEL } from '@/config';
import { isContentFlagged } from '@/lib/moderation';
import {
  findPokemon,
  getDefensiveProfile,
  getTypeEffectiveness,
  getBestAttackingTypes,
  findAbility,
  formatMultiplier,
  suggestRole,
  getMegaEvolution,
  getRegionalForm,
  comparePokemon,
  PokemonType
} from '@/lib/pokemon/data';

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

function extractPokemonContext(query: string): string {
    const lowerQuery = query.toLowerCase();
    const contextParts: string[] = [];
    
    const pokemonNames = [
        'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
        'squirtle', 'wartortle', 'blastoise', 'pikachu', 'raichu', 'mewtwo', 'mew',
        'dragonite', 'gyarados', 'lapras', 'snorlax', 'articuno', 'zapdos', 'moltres',
        'tyranitar', 'lugia', 'ho-oh', 'celebi', 'blaziken', 'gardevoir', 'metagross',
        'salamence', 'rayquaza', 'groudon', 'kyogre', 'latios', 'latias', 'jirachi',
        'garchomp', 'lucario', 'togekiss', 'dialga', 'palkia', 'giratina', 'darkrai',
        'arceus', 'hydreigon', 'volcarona', 'reshiram', 'zekrom', 'kyurem', 'genesect',
        'greninja', 'aegislash', 'xerneas', 'yveltal', 'zygarde', 'diancie',
        'decidueye', 'incineroar', 'primarina', 'mimikyu', 'toxapex', 'tapu koko',
        'lunala', 'solgaleo', 'necrozma', 'marshadow', 'zeraora',
        'dragapult', 'corviknight', 'grimmsnarl', 'zacian', 'zamazenta', 'eternatus',
        'urshifu', 'calyrex', 'spectrier', 'glastrier',
        'meowscarada', 'skeledirge', 'quaquaval', 'palafin', 'annihilape', 'gholdengo',
        'iron valiant', 'roaring moon', 'koraidon', 'miraidon', 'gengar', 'alakazam',
        'machamp', 'golem', 'slowbro', 'magneton', 'cloyster', 'haunter', 'onix',
        'hypno', 'electrode', 'exeggutor', 'marowak', 'hitmonlee', 'hitmonchan',
        'weezing', 'rhydon', 'chansey', 'tangela', 'kangaskhan', 'seadra', 'starmie',
        'scyther', 'jynx', 'electabuzz', 'magmar', 'pinsir', 'tauros', 'ditto',
        'eevee', 'vaporeon', 'jolteon', 'flareon', 'porygon', 'omastar', 'kabutops',
        'aerodactyl', 'espeon', 'umbreon', 'slowking', 'scizor', 'heracross',
        'ursaring', 'kingdra', 'donphan', 'porygon2', 'hitmontop', 'blissey',
        'entei', 'raikou', 'suicune', 'swampert', 'sceptile', 'breloom', 'slaking',
        'aggron', 'manectric', 'sharpedo', 'camerupt', 'flygon', 'altaria', 'absol',
        'glalie', 'walrein', 'milotic', 'registeel', 'regice', 'regirock', 'deoxys',
        'infernape', 'empoleon', 'staraptor', 'luxray', 'roserade', 'rampardos',
        'bastiodon', 'floatzel', 'gastrodon', 'drifblim', 'lopunny', 'mismagius',
        'honchkrow', 'spiritomb', 'hippowdon', 'drapion', 'toxicroak', 'weavile',
        'magnezone', 'electivire', 'magmortar', 'leafeon', 'glaceon', 'gliscor',
        'mamoswine', 'porygon-z', 'gallade', 'dusknoir', 'froslass', 'rotom',
        'uxie', 'mesprit', 'azelf', 'heatran', 'regigigas', 'cresselia', 'manaphy',
        'shaymin', 'serperior', 'emboar', 'samurott', 'excadrill', 'conkeldurr',
        'seismitoad', 'scolipede', 'krookodile', 'darmanitan', 'cofagrigus',
        'reuniclus', 'escavalier', 'amoonguss', 'ferrothorn', 'chandelure',
        'haxorus', 'beartic', 'mienshao', 'bisharp', 'braviary', 'mandibuzz',
        'durant', 'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus',
        'landorus', 'keldeo', 'meloetta', 'talonflame', 'pyroar', 'florges',
        'pangoro', 'malamar', 'barbaracle', 'dragalge', 'clawitzer', 'heliolisk',
        'tyrantrum', 'aurorus', 'sylveon', 'hawlucha', 'goodra', 'klefki',
        'trevenant', 'avalugg', 'noivern', 'hoopa', 'volcanion', 'vikavolt',
        'crabominable', 'ribombee', 'lycanroc', 'wishiwashi', 'mareanie', 'araquanid',
        'lurantis', 'shiinotic', 'salazzle', 'bewear', 'tsareena', 'comfey',
        'oranguru', 'passimian', 'golisopod', 'sandygast', 'palossand', 'pyukumuku',
        'turtonator', 'togedemaru', 'kommo-o', 'tapu lele', 'tapu bulu', 'tapu fini',
        'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela', 'kartana',
        'guzzlord', 'poipole', 'naganadel', 'stakataka', 'blacephalon',
        'rillaboom', 'cinderace', 'inteleon', 'orbeetle', 'thievul', 'eldegoss',
        'dubwool', 'drednaw', 'boltund', 'coalossal', 'flapple', 'appletun',
        'sandaconda', 'cramorant', 'barraskewda', 'toxtricity', 'centiskorch',
        'polteageist', 'hatterene', 'obstagoon', 'perrserker', 'cursola', 'sirfetchd',
        'runerigus', 'alcremie', 'falinks', 'pincurchin', 'frosmoth', 'stonjourner',
        'eiscue', 'indeedee', 'morpeko', 'copperajah', 'dracozolt', 'arctozolt',
        'dracovish', 'arctovish', 'duraludon', 'dreepy', 'drakloak',
        'regieleki', 'regidrago', 'glastrier', 'spectrier',
        'wyrdeer', 'kleavor', 'ursaluna', 'basculegion', 'sneasler', 'overqwil',
        'enamorus', 'sprigatito', 'floragato', 'crocalor', 'armarouge', 'ceruledge',
        'bellibolt', 'kilowattrel', 'mabosstiff', 'grafaiai', 'brambleghast',
        'toedscruel', 'klawf', 'scovillain', 'rabsca', 'flittle', 'espathra',
        'tinkatink', 'tinkatuff', 'tinkaton', 'wiglett', 'wugtrio', 'bombirdier',
        'finizen', 'varoom', 'revavroom', 'cyclizar', 'orthworm', 'glimmet',
        'glimmora', 'greavard', 'houndstone', 'flamigo', 'cetoddle', 'cetitan',
        'veluza', 'dondozo', 'tatsugiri', 'clodsire', 'farigiraf', 'dudunsparce',
        'kingambit', 'great tusk', 'scream tail', 'brute bonnet', 'flutter mane',
        'slither wing', 'sandy shocks', 'iron treads', 'iron bundle', 'iron hands',
        'iron jugulis', 'iron moth', 'iron thorns', 'frigibax', 'arctibax', 'baxcalibur',
        'gimmighoul', 'gholdengo', 'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu',
        'walking wake', 'iron leaves', 'dipplin', 'poltchageist', 'sinistcha',
        'okidogi', 'munkidori', 'fezandipiti', 'ogerpon', 'archaludon', 'hydrapple',
        'gouging fire', 'raging bolt', 'iron boulder', 'iron crown', 'terapagos', 'pecharunt'
    ];
    
    for (const name of pokemonNames) {
        if (lowerQuery.includes(name)) {
            const pokemon = findPokemon(name);
            if (pokemon) {
                const profile = getDefensiveProfile(pokemon.types as PokemonType[]);
                const role = suggestRole(pokemon);
                
                contextParts.push(`
## ${pokemon.name} Data
- **Types**: ${pokemon.types.join('/')}
- **Generation**: ${pokemon.generation}
- **Tier**: ${pokemon.tier}
- **Stats**: HP ${pokemon.stats.hp} | Atk ${pokemon.stats.attack} | Def ${pokemon.stats.defense} | SpA ${pokemon.stats.spAtk} | SpD ${pokemon.stats.spDef} | Spe ${pokemon.stats.speed} | BST ${pokemon.stats.total}
- **Abilities**: ${pokemon.abilities.normal.join(', ')}${pokemon.abilities.hidden ? ` | Hidden: ${pokemon.abilities.hidden}` : ''}
- **Role**: ${role}
- **Weaknesses**: ${profile.weaknesses.map(w => `${w.type} (${formatMultiplier(w.multiplier)})`).join(', ') || 'None'}
- **Resistances**: ${profile.resistances.map(r => `${r.type} (${formatMultiplier(r.multiplier)})`).join(', ') || 'None'}
- **Immunities**: ${profile.immunities.map(i => i.type).join(', ') || 'None'}
${pokemon.evolution ? `- **Evolution**: ${pokemon.evolution.chain.join(' → ')}` : '- Does not evolve'}
${pokemon.lore ? `- **Lore**: ${pokemon.lore}` : ''}
`);
                
                const mega = getMegaEvolution(name);
                if (mega) {
                    contextParts.push(`
### Mega ${pokemon.name}
- **Types**: ${mega.types.join('/')}
- **Ability**: ${mega.ability}
- **Stats**: HP ${mega.stats.hp} | Atk ${mega.stats.attack} | Def ${mega.stats.defense} | SpA ${mega.stats.spAtk} | SpD ${mega.stats.spDef} | Spe ${mega.stats.speed} | BST ${mega.stats.total}
`);
                }
            }
        }
    }
    
    const types: PokemonType[] = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
    
    const mentionedTypes: PokemonType[] = [];
    for (const type of types) {
        if (lowerQuery.includes(type)) {
            mentionedTypes.push(type);
        }
    }
    
    if (mentionedTypes.length > 0 && (lowerQuery.includes('weakness') || lowerQuery.includes('effective') || lowerQuery.includes('beat') || lowerQuery.includes('counter') || lowerQuery.includes('strength'))) {
        const profile = getDefensiveProfile(mentionedTypes);
        const counters = getBestAttackingTypes(mentionedTypes);
        
        contextParts.push(`
## ${mentionedTypes.join('/')} Type Analysis
- **Weaknesses**: ${profile.weaknesses.map(w => `${w.type} (${formatMultiplier(w.multiplier)})`).join(', ') || 'None'}
- **Resistances**: ${profile.resistances.map(r => `${r.type} (${formatMultiplier(r.multiplier)})`).join(', ') || 'None'}
- **Immunities**: ${profile.immunities.map(i => i.type).join(', ') || 'None'}
- **Best Counter Types**: ${counters.slice(0, 5).join(', ')}
`);
    }
    
    if (lowerQuery.includes(' vs ') || lowerQuery.includes('compare') || lowerQuery.includes('versus')) {
        for (let i = 0; i < pokemonNames.length; i++) {
            if (lowerQuery.includes(pokemonNames[i])) {
                for (let j = i + 1; j < pokemonNames.length; j++) {
                    if (lowerQuery.includes(pokemonNames[j])) {
                        const comparison = comparePokemon(pokemonNames[i], pokemonNames[j]);
                        if (comparison.pokemon1 && comparison.pokemon2) {
                            const p1 = comparison.pokemon1;
                            const p2 = comparison.pokemon2;
                            contextParts.push(`
## ${p1.name} vs ${p2.name} Comparison
| Stat | ${p1.name} | ${p2.name} | Winner |
|------|----------|----------|--------|
| HP | ${p1.stats.hp} | ${p2.stats.hp} | ${p1.stats.hp > p2.stats.hp ? p1.name : p2.name} |
| Attack | ${p1.stats.attack} | ${p2.stats.attack} | ${p1.stats.attack > p2.stats.attack ? p1.name : p2.name} |
| Defense | ${p1.stats.defense} | ${p2.stats.defense} | ${p1.stats.defense > p2.stats.defense ? p1.name : p2.name} |
| Sp.Atk | ${p1.stats.spAtk} | ${p2.stats.spAtk} | ${p1.stats.spAtk > p2.stats.spAtk ? p1.name : p2.name} |
| Sp.Def | ${p1.stats.spDef} | ${p2.stats.spDef} | ${p1.stats.spDef > p2.stats.spDef ? p1.name : p2.name} |
| Speed | ${p1.stats.speed} | ${p2.stats.speed} | ${p1.stats.speed > p2.stats.speed ? p1.name : p2.name} |
| **BST** | ${p1.stats.total} | ${p2.stats.total} | ${p1.stats.total > p2.stats.total ? p1.name : p2.name} |

- **Type Advantage**: ${p1.name} vs ${p2.name}: ${formatMultiplier(comparison.typeAdvantage.p1VsP2)}, ${p2.name} vs ${p1.name}: ${formatMultiplier(comparison.typeAdvantage.p2VsP1)}
`);
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    
    return contextParts.join('\n');
}

export async function POST(req: Request) {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return new Response('Invalid messages format', { status: 400 });
    }

    const latestUserMessage = messages.filter(msg => msg.role === 'user').pop();
    const userQuery = latestUserMessage ? getMessageText(latestUserMessage) : '';

    if (userQuery) {
        const moderationResult = await isContentFlagged(userQuery);
        if (moderationResult.flagged) {
            return new Response(JSON.stringify({ error: moderationResult.denialMessage }), { 
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    const pokemonContext = extractPokemonContext(userQuery);
    
    const systemPrompt = `You are Pokémon Battle Assistant, an expert Pokémon strategist.
You have comprehensive knowledge of all Pokémon, types, abilities, stats, and competitive strategies.

${pokemonContext ? `## Relevant Pokémon Data for This Query:\n${pokemonContext}` : ''}

## Response Guidelines:
- Be concise and helpful
- Use the data provided above when available
- Format type matchups clearly (4×, 2×, 1×, ½×, ¼×, 0×)
- Highlight critical weaknesses (4×) as threats
- Give practical battle advice
- If asked about a Pokémon not in the data, provide general knowledge`;

    const convertedMessages = convertMessages(messages);

    const result = streamText({
        model: MODEL,
        system: systemPrompt,
        messages: convertedMessages,
    });

    return result.toTextStreamResponse();
}
