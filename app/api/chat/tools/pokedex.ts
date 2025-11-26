import { tool } from 'ai';
import { z } from 'zod';
import {
  lookupPokedexEntry,
  lookupRegionalForms,
  lookupPokemonStrategy,
  lookupMegaEvolutions,
  lookupGigantamax,
  lookupTerastallization,
  lookupPokemon,
  getAllRegionalForms,
  PokemonType,
  getDefensiveProfile,
  findDualTypeCounters
} from '@/lib/pokemon';

const pokemonTypeSchema = z.enum([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]);

export const pokedexLookup = tool({
  description: `Look up comprehensive Pokémon information from the Pokédex. Use this tool for:
- Individual Pokémon data (stats, abilities, evolution, lore)
- Regional forms (Alolan, Galarian, Hisuian, Paldean variants)
- Mega Evolution information
- Gigantamax forms and G-Max moves
- Terastallization mechanics
- Battle strategy generation for specific Pokémon

This is the RAG-powered Pokédex with detailed information across all generations.`,
  
  inputSchema: z.object({
    queryType: z.enum([
      'pokemon_info',
      'regional_forms',
      'battle_strategy',
      'mega_evolutions',
      'gigantamax',
      'terastallization',
      'evolution_chain',
      'compare_pokemon'
    ]).describe('The type of Pokédex query to perform'),
    
    pokemonName: z.string().optional().describe('The name of the Pokémon to look up'),
    
    comparePokemon: z.array(z.string()).optional().describe('Two Pokémon names to compare'),
  }),
  
  execute: async ({ queryType, pokemonName, comparePokemon }) => {
    try {
      switch (queryType) {
        case 'pokemon_info': {
          if (!pokemonName) {
            return {
              success: false,
              error: 'Please specify a Pokémon name to look up'
            };
          }
          const result = lookupPokedexEntry(pokemonName);
          return {
            success: true,
            queryType,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'regional_forms': {
          if (!pokemonName) {
            return {
              success: false,
              error: 'Please specify a Pokémon name to find regional forms for'
            };
          }
          const result = lookupRegionalForms(pokemonName);
          return {
            success: true,
            queryType,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'battle_strategy': {
          if (!pokemonName) {
            return {
              success: false,
              error: 'Please specify a Pokémon name to generate battle strategy for'
            };
          }
          const result = lookupPokemonStrategy(pokemonName);
          return {
            success: true,
            queryType,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'mega_evolutions': {
          const result = lookupMegaEvolutions();
          return {
            success: true,
            queryType,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'gigantamax': {
          const result = lookupGigantamax();
          return {
            success: true,
            queryType,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'terastallization': {
          const result = lookupTerastallization();
          return {
            success: true,
            queryType,
            result: result.result
          };
        }
        
        case 'evolution_chain': {
          if (!pokemonName) {
            return {
              success: false,
              error: 'Please specify a Pokémon name to find evolution chain for'
            };
          }
          const entry = lookupPokemon(pokemonName);
          if (!entry) {
            return {
              success: false,
              error: `Pokémon "${pokemonName}" not found`
            };
          }
          
          const lines: string[] = [];
          lines.push(`## Evolution Chain: ${entry.name}`);
          lines.push('');
          
          if (entry.evolution) {
            lines.push(`**Chain:** ${entry.evolution.chain.join(' → ')}`);
            lines.push(`**Current Stage:** ${entry.evolution.stage} of ${entry.evolution.chain.length}`);
            
            if (entry.evolution.previous) {
              lines.push(`**Evolves from:** ${entry.evolution.previous.pokemon} via ${entry.evolution.previous.method}`);
            }
            if (entry.evolution.next) {
              lines.push(`**Evolves into:** ${entry.evolution.next.pokemon} via ${entry.evolution.next.method}`);
            }
          } else {
            lines.push('This Pokémon does not evolve.');
          }
          
          if (entry.megaEvolution || entry.megaEvolutions) {
            lines.push('');
            lines.push('**Can Mega Evolve:** Yes');
          }
          
          const regionalForms = getAllRegionalForms(pokemonName);
          if (regionalForms.length > 0) {
            lines.push('');
            lines.push(`**Regional Forms Available:** ${regionalForms.map(f => f.region).join(', ')}`);
          }
          
          return {
            success: true,
            queryType,
            result: lines.join('\n'),
            metadata: {
              evolutionChain: entry.evolution?.chain,
              hasMega: !!(entry.megaEvolution || entry.megaEvolutions),
              regionalForms: regionalForms.length
            }
          };
        }
        
        case 'compare_pokemon': {
          if (!comparePokemon || comparePokemon.length < 2) {
            return {
              success: false,
              error: 'Please specify two Pokémon names to compare'
            };
          }
          
          const [name1, name2] = comparePokemon;
          const pokemon1 = lookupPokemon(name1);
          const pokemon2 = lookupPokemon(name2);
          
          if (!pokemon1) {
            return { success: false, error: `Pokémon "${name1}" not found` };
          }
          if (!pokemon2) {
            return { success: false, error: `Pokémon "${name2}" not found` };
          }
          
          const lines: string[] = [];
          lines.push(`## Comparison: ${pokemon1.name} vs ${pokemon2.name}`);
          lines.push('');
          
          lines.push('### Type Comparison');
          lines.push(`**${pokemon1.name}:** ${pokemon1.types.map(t => t.toUpperCase()).join('/')}`);
          lines.push(`**${pokemon2.name}:** ${pokemon2.types.map(t => t.toUpperCase()).join('/')}`);
          lines.push('');
          
          lines.push('### Base Stat Comparison');
          lines.push('| Stat | ' + pokemon1.name + ' | ' + pokemon2.name + ' | Difference |');
          lines.push('|------|---------|---------|------------|');
          
          const stats = ['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'] as const;
          const statNames: Record<string, string> = {
            hp: 'HP',
            attack: 'Attack',
            defense: 'Defense',
            specialAttack: 'Sp. Atk',
            specialDefense: 'Sp. Def',
            speed: 'Speed'
          };
          
          for (const stat of stats) {
            const val1 = pokemon1.stats[stat];
            const val2 = pokemon2.stats[stat];
            const diff = val1 - val2;
            const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
            const winner = diff > 0 ? '←' : diff < 0 ? '→' : '=';
            lines.push(`| ${statNames[stat]} | ${val1} | ${val2} | ${diffStr} ${winner} |`);
          }
          
          lines.push(`| **Total** | **${pokemon1.stats.total}** | **${pokemon2.stats.total}** | ${pokemon1.stats.total - pokemon2.stats.total > 0 ? '+' : ''}${pokemon1.stats.total - pokemon2.stats.total} |`);
          lines.push('');
          
          const def1 = getDefensiveProfile(pokemon1.types);
          const def2 = getDefensiveProfile(pokemon2.types);
          const counters1 = findDualTypeCounters(pokemon1.types);
          const counters2 = findDualTypeCounters(pokemon2.types);
          
          lines.push('### Type Matchup (1v1)');
          
          let p1Damage = 1;
          let p2Damage = 1;
          for (const type of pokemon1.types) {
            for (const defType of pokemon2.types) {
              const counter = counters2.bestAttackingTypes.find(c => c.type === type);
              if (counter) p1Damage = Math.max(p1Damage, counter.effectiveness);
            }
          }
          for (const type of pokemon2.types) {
            for (const defType of pokemon1.types) {
              const counter = counters1.bestAttackingTypes.find(c => c.type === type);
              if (counter) p2Damage = Math.max(p2Damage, counter.effectiveness);
            }
          }
          
          lines.push(`**${pokemon1.name} STAB damage to ${pokemon2.name}:** ${p1Damage}x`);
          lines.push(`**${pokemon2.name} STAB damage to ${pokemon1.name}:** ${p2Damage}x`);
          
          if (p1Damage > p2Damage) {
            lines.push(`**Advantage:** ${pokemon1.name}`);
          } else if (p2Damage > p1Damage) {
            lines.push(`**Advantage:** ${pokemon2.name}`);
          } else {
            lines.push('**Advantage:** Even matchup');
          }
          lines.push('');
          
          lines.push('### Role Comparison');
          const role1 = pokemon1.stats.attack > pokemon1.stats.specialAttack ? 'Physical' : 'Special';
          const role2 = pokemon2.stats.attack > pokemon2.stats.specialAttack ? 'Physical' : 'Special';
          const speed1 = pokemon1.stats.speed >= 100 ? 'Fast' : pokemon1.stats.speed >= 70 ? 'Mid' : 'Slow';
          const speed2 = pokemon2.stats.speed >= 100 ? 'Fast' : pokemon2.stats.speed >= 70 ? 'Mid' : 'Slow';
          
          lines.push(`**${pokemon1.name}:** ${role1} ${speed1} (${pokemon1.competitiveTier || 'Untiered'})`);
          lines.push(`**${pokemon2.name}:** ${role2} ${speed2} (${pokemon2.competitiveTier || 'Untiered'})`);
          
          return {
            success: true,
            queryType,
            result: lines.join('\n'),
            metadata: {
              pokemon1: { name: pokemon1.name, types: pokemon1.types, bst: pokemon1.stats.total },
              pokemon2: { name: pokemon2.name, types: pokemon2.types, bst: pokemon2.stats.total }
            }
          };
        }
        
        default:
          return {
            success: false,
            error: 'Unknown query type'
          };
      }
    } catch (error) {
      console.error('Pokédex lookup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});
