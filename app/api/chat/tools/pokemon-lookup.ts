import { tool } from 'ai';
import { z } from 'zod';
import {
  PokemonType,
  lookupTypeMatchup,
  lookupCounters,
  lookupBattleStrategy,
  lookupAbility,
  lookupPriorityMoves,
  lookupSpeedControl,
  getTypeMatchupSummary,
  getDefensiveProfile,
  findDualTypeCounters
} from '@/lib/pokemon';

const pokemonTypeSchema = z.enum([
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]);

export const pokemonLookup = tool({
  description: `Look up Pokémon type matchups, counters, battle strategies, abilities, and priority moves. Use this tool for:
- Type effectiveness queries (e.g., "Is Fire effective against Steel?")
- Finding counters for specific types (e.g., "What beats Dragon/Flying?")
- Battle strategy recommendations
- Ability information and synergies
- Priority move lookups
- Speed control options

This provides fast, deterministic answers for Pokémon battle mechanics.`,
  
  inputSchema: z.object({
    queryType: z.enum([
      'type_matchup',
      'counters', 
      'battle_strategy',
      'ability',
      'priority_moves',
      'speed_control',
      'defensive_profile'
    ]).describe('The type of Pokémon lookup to perform'),
    
    attackerType: pokemonTypeSchema.optional().describe('The attacking type for matchup calculations'),
    
    defenderTypes: z.array(pokemonTypeSchema).optional().describe('The defending type(s) - can be single or dual type'),
    
    abilityName: z.string().optional().describe('The ability name to look up'),
    
    priorityType: pokemonTypeSchema.optional().describe('Filter priority moves by type')
  }),
  
  execute: async ({ queryType, attackerType, defenderTypes, abilityName, priorityType }) => {
    try {
      switch (queryType) {
        case 'type_matchup': {
          const types = (defenderTypes || []) as PokemonType[];
          const attacker = attackerType as PokemonType | undefined;
          const result = lookupTypeMatchup(attacker || null, types);
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'counters': {
          const types = (defenderTypes || []) as PokemonType[];
          if (types.length === 0) {
            return {
              success: false,
              error: 'Please specify at least one defender type to find counters for'
            };
          }
          const result = lookupCounters(types);
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'battle_strategy': {
          const types = (defenderTypes || []) as PokemonType[];
          const ability = abilityName || 'unknown';
          if (types.length === 0) {
            return {
              success: false,
              error: 'Please specify at least one type for battle strategy'
            };
          }
          const result = lookupBattleStrategy(types, ability);
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'ability': {
          if (!abilityName) {
            return {
              success: false,
              error: 'Please specify an ability name to look up'
            };
          }
          const result = lookupAbility(abilityName);
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result,
            metadata: result.metadata
          };
        }
        
        case 'priority_moves': {
          const type = priorityType as PokemonType | undefined;
          const result = lookupPriorityMoves(type);
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result
          };
        }
        
        case 'speed_control': {
          const result = lookupSpeedControl();
          return {
            success: true,
            lookupType: queryType,
            query: result.query,
            result: result.result
          };
        }
        
        case 'defensive_profile': {
          const types = (defenderTypes || []) as PokemonType[];
          if (types.length === 0) {
            return {
              success: false,
              error: 'Please specify at least one type for defensive profile'
            };
          }
          const profile = getDefensiveProfile(types);
          const summary = getTypeMatchupSummary(types);
          const counters = findDualTypeCounters(types);
          
          return {
            success: true,
            lookupType: queryType,
            result: summary,
            metadata: {
              profile,
              counters: counters.bestAttackingTypes.slice(0, 5)
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
      console.error('Pokemon lookup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});

export const pokemonBattleAnalysis = tool({
  description: `Analyze a Pokémon battle matchup with detailed strategic recommendations. Use this for complex battle queries like:
- "How do I beat Garchomp?"
- "What's the best strategy against a Rain team?"
- "Counter this Dragon/Fairy type with Levitate"
- Team composition advice`,
  
  inputSchema: z.object({
    opponentTypes: z.array(pokemonTypeSchema).min(1).max(2).describe('The opponent Pokémon types (1-2 types)'),
    opponentAbility: z.string().optional().describe('The opponent\'s ability if known'),
    yourTypes: z.array(pokemonTypeSchema).optional().describe('Your Pokémon types if you want specific matchup advice'),
    yourAbility: z.string().optional().describe('Your Pokémon\'s ability if known'),
    context: z.enum(['singles', 'doubles', 'general']).optional().describe('Battle format context')
  }),
  
  execute: async ({ opponentTypes, opponentAbility, yourTypes, context = 'general' }) => {
    const oppTypes = opponentTypes as PokemonType[];
    const ownTypes = (yourTypes || []) as PokemonType[];
    
    const lines: string[] = [];
    
    lines.push(`## Battle Analysis: vs ${oppTypes.map(t => t.toUpperCase()).join('/')}`);
    if (opponentAbility) {
      lines.push(`**Opponent Ability:** ${opponentAbility}`);
    }
    lines.push(`**Format:** ${context}`);
    lines.push('');
    
    const oppDefense = getDefensiveProfile(oppTypes);
    const oppCounters = findDualTypeCounters(oppTypes);
    
    lines.push('### Opponent Weaknesses');
    if (oppDefense.weaknesses.length > 0) {
      for (const w of oppDefense.weaknesses) {
        lines.push(`- **${w.type.toUpperCase()}** deals ${w.multiplier}x damage`);
      }
    } else {
      lines.push('No major weaknesses (very defensive typing)');
    }
    lines.push('');
    
    lines.push('### Opponent Resistances');
    if (oppDefense.resistances.length > 0) {
      const resStr = oppDefense.resistances.map(r => `${r.type} (${r.multiplier}x)`).join(', ');
      lines.push(resStr);
    } else {
      lines.push('No resistances');
    }
    lines.push('');
    
    if (oppDefense.immunities.length > 0) {
      lines.push('### Immunities (Avoid These Types!)');
      lines.push(oppDefense.immunities.map(i => i.toUpperCase()).join(', '));
      lines.push('');
    }
    
    lines.push('### Recommended Counter Types');
    const topCounters = oppCounters.bestAttackingTypes.slice(0, 4);
    if (topCounters.length > 0) {
      for (const c of topCounters) {
        lines.push(`1. **${c.type.toUpperCase()}** - ${c.effectiveness}x super effective`);
      }
    }
    lines.push('');
    
    if (ownTypes.length > 0) {
      lines.push(`### Your Matchup (${ownTypes.map(t => t.toUpperCase()).join('/')})`);
      
      let yourAdvantage = 1;
      let oppAdvantage = 1;
      
      for (const yourType of ownTypes) {
        const yourDamage = lookupTypeMatchup(yourType, oppTypes);
        yourAdvantage = Math.max(yourAdvantage, (yourDamage.metadata?.effectiveness as number) || 1);
      }
      
      for (const oppType of oppTypes) {
        const oppDamage = lookupTypeMatchup(oppType, ownTypes);
        oppAdvantage = Math.max(oppAdvantage, (oppDamage.metadata?.effectiveness as number) || 1);
      }
      
      if (yourAdvantage > oppAdvantage) {
        lines.push('**Verdict: FAVORABLE** - You have the type advantage');
      } else if (oppAdvantage > yourAdvantage) {
        lines.push('**Verdict: UNFAVORABLE** - Opponent has the type advantage');
      } else {
        lines.push('**Verdict: EVEN** - Neither side has a clear type advantage');
      }
      lines.push('');
    }
    
    lines.push('### Strategic Recommendations');
    if (context === 'doubles') {
      lines.push('- Consider using spread moves to hit multiple targets');
      lines.push('- Protect/Fake Out can disrupt opponent\'s strategy');
      lines.push('- Intimidate support weakens physical attackers');
    } else {
      lines.push('- Lead with a Pokémon that resists their STAB moves');
      if (topCounters.length > 0) {
        lines.push(`- Priority: Get ${topCounters[0].type.toUpperCase()} coverage`);
      }
    }
    
    if (opponentAbility) {
      const abilityInfo = lookupAbility(opponentAbility);
      if (abilityInfo.result && !abilityInfo.result.includes('No detailed information')) {
        lines.push('');
        lines.push('### Ability Consideration');
        lines.push(abilityInfo.result);
      }
    }
    
    return {
      success: true,
      analysis: lines.join('\n'),
      counters: topCounters,
      weaknesses: oppDefense.weaknesses,
      immunities: oppDefense.immunities
    };
  }
});
