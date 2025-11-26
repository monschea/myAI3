import { tool } from 'ai';
import { z } from 'zod';
import {
  getTypeEffectiveness,
  getDefensiveProfile,
  getOffensiveProfile,
  getBestAttackingTypes,
  findAbility,
  formatMultiplier,
  typeChart,
  PokemonType
} from '@/lib/pokemon/data';

export const pokemonLookup = tool({
  description: 'Look up Pokémon type effectiveness, defensive profiles, and ability information. Use for quick type matchup queries.',
  inputSchema: z.object({
    queryType: z.enum([
      'type_matchup',
      'defensive_profile', 
      'offensive_profile',
      'ability_info',
      'counters',
      'type_chart'
    ]).describe('Type of lookup to perform'),
    attackType: z.string().optional().describe('Attacking type for matchup calculations'),
    defenderTypes: z.array(z.string()).optional().describe('Defending type(s) - can be dual typed'),
    abilityName: z.string().optional().describe('Ability name to look up'),
  }),
  execute: async ({ queryType, attackType, defenderTypes, abilityName }) => {
    try {
      switch (queryType) {
        case 'type_matchup': {
          if (!attackType || !defenderTypes?.length) {
            return { error: 'Need attackType and defenderTypes for matchup calculation' };
          }
          const mult = getTypeEffectiveness(
            attackType.toLowerCase() as PokemonType,
            defenderTypes.map(t => t.toLowerCase() as PokemonType)
          );
          return {
            attackType,
            defenderTypes,
            effectiveness: mult,
            formatted: formatMultiplier(mult),
            description: mult === 0 ? 'No effect (immune)' :
                        mult >= 4 ? 'SUPER effective (4×)!' :
                        mult >= 2 ? 'Super effective (2×)' :
                        mult <= 0.25 ? 'Barely effective (¼×)' :
                        mult < 1 ? 'Not very effective' : 'Normal effectiveness'
          };
        }

        case 'defensive_profile': {
          if (!defenderTypes?.length) {
            return { error: 'Need defenderTypes for defensive profile' };
          }
          const types = defenderTypes.map(t => t.toLowerCase() as PokemonType);
          const profile = getDefensiveProfile(types);
          
          return {
            types: defenderTypes,
            quadWeaknesses: profile.quadWeaknesses.map(w => ({
              type: w.type,
              multiplier: formatMultiplier(w.multiplier)
            })),
            weaknesses: profile.weaknesses.filter(w => w.multiplier < 4).map(w => ({
              type: w.type,
              multiplier: formatMultiplier(w.multiplier)
            })),
            resistances: profile.resistances.map(r => ({
              type: r.type,
              multiplier: formatMultiplier(r.multiplier)
            })),
            immunities: profile.immunities.map(i => i.type),
            summary: {
              totalWeaknesses: profile.weaknesses.length,
              totalResistances: profile.resistances.length,
              totalImmunities: profile.immunities.length,
              criticalThreats: profile.quadWeaknesses.length
            }
          };
        }

        case 'offensive_profile': {
          if (!defenderTypes?.length) {
            return { error: 'Need types for offensive profile' };
          }
          const types = defenderTypes.map(t => t.toLowerCase() as PokemonType);
          const profile = getOffensiveProfile(types);
          
          return {
            attackingTypes: defenderTypes,
            superEffective: profile.superEffective.map(t => t.type),
            notVeryEffective: profile.notVeryEffective.map(t => t.type),
            noEffect: profile.noEffect.map(t => t.type)
          };
        }

        case 'counters': {
          if (!defenderTypes?.length) {
            return { error: 'Need defenderTypes to find counters' };
          }
          const types = defenderTypes.map(t => t.toLowerCase() as PokemonType);
          const bestTypes = getBestAttackingTypes(types);
          const profile = getDefensiveProfile(types);
          
          return {
            targetTypes: defenderTypes,
            bestCounterTypes: bestTypes,
            quadWeaknesses: profile.quadWeaknesses.map(w => w.type),
            regularWeaknesses: profile.weaknesses.filter(w => w.multiplier < 4).map(w => w.type),
            recommendation: profile.quadWeaknesses.length > 0 
              ? `Priority: Use ${profile.quadWeaknesses[0].type.toUpperCase()} attacks for 4× damage!`
              : `Use ${bestTypes[0]?.toUpperCase() || 'any super effective'} attacks for 2× damage`
          };
        }

        case 'ability_info': {
          if (!abilityName) {
            return { error: 'Need abilityName to look up' };
          }
          const ability = findAbility(abilityName);
          if (!ability) {
            return { error: `Ability "${abilityName}" not found` };
          }
          return {
            name: ability.name,
            description: ability.description,
            effect: ability.effect,
            competitiveRating: ability.competitive,
            pokemonWithAbility: ability.pokemon
          };
        }

        case 'type_chart': {
          return {
            allTypes: typeChart.types,
            colors: typeChart.typeColors,
            note: 'Use type_matchup query for specific effectiveness calculations'
          };
        }

        default:
          return { error: 'Unknown query type' };
      }
    } catch (error) {
      console.error('Pokemon lookup error:', error);
      return { error: 'Failed to perform lookup' };
    }
  },
});

export const pokemonBattleAnalysis = tool({
  description: 'Analyze battle matchups and provide strategic recommendations. Use for team building and battle strategy questions.',
  inputSchema: z.object({
    analysisType: z.enum([
      'matchup_analysis',
      'team_weakness',
      'coverage_check'
    ]).describe('Type of battle analysis'),
    opponentTypes: z.array(z.string()).optional().describe('Opponent Pokémon type(s)'),
    teamTypes: z.array(z.array(z.string())).optional().describe('Array of type arrays for each team member'),
    attackingTypes: z.array(z.string()).optional().describe('Types of attacking moves available'),
  }),
  execute: async ({ analysisType, opponentTypes, teamTypes, attackingTypes }) => {
    try {
      switch (analysisType) {
        case 'matchup_analysis': {
          if (!opponentTypes?.length) {
            return { error: 'Need opponentTypes for matchup analysis' };
          }
          
          const types = opponentTypes.map(t => t.toLowerCase() as PokemonType);
          const profile = getDefensiveProfile(types);
          const bestCounters = getBestAttackingTypes(types);
          
          const physicalTypes: PokemonType[] = ['fighting', 'ground', 'rock', 'steel', 'normal'];
          const specialTypes: PokemonType[] = ['fire', 'water', 'electric', 'grass', 'ice', 'psychic', 'dragon', 'dark', 'fairy'];
          
          const physicalCounters = bestCounters.filter(t => physicalTypes.includes(t));
          const specialCounters = bestCounters.filter(t => specialTypes.includes(t));
          
          return {
            opponent: opponentTypes.join('/').toUpperCase(),
            analysis: {
              criticalWeaknesses: profile.quadWeaknesses.map(w => `${w.type.toUpperCase()} (4×)`),
              standardWeaknesses: profile.weaknesses.filter(w => w.multiplier < 4).map(w => `${w.type.toUpperCase()} (2×)`),
              resistances: profile.resistances.map(r => `${r.type.toUpperCase()} (${formatMultiplier(r.multiplier)})`),
              immunities: profile.immunities.map(i => i.type.toUpperCase())
            },
            strategy: {
              bestPhysicalTypes: physicalCounters.slice(0, 3),
              bestSpecialTypes: specialCounters.slice(0, 3),
              priorityTargets: profile.quadWeaknesses.length > 0 
                ? `Exploit 4× weakness to ${profile.quadWeaknesses[0].type.toUpperCase()}`
                : `Target ${bestCounters[0]?.toUpperCase()} weakness`,
              avoid: profile.immunities.length > 0
                ? `Never use ${profile.immunities.map(i => i.type.toUpperCase()).join(', ')} moves`
                : 'No immunities to worry about'
            }
          };
        }

        case 'team_weakness': {
          if (!teamTypes?.length) {
            return { error: 'Need teamTypes array for team analysis' };
          }
          
          const weaknessCounts: Record<string, number> = {};
          const resistanceCounts: Record<string, number> = {};
          
          for (const memberTypes of teamTypes) {
            const types = memberTypes.map(t => t.toLowerCase() as PokemonType);
            const profile = getDefensiveProfile(types);
            
            for (const w of profile.weaknesses) {
              weaknessCounts[w.type] = (weaknessCounts[w.type] || 0) + 1;
            }
            for (const r of profile.resistances) {
              resistanceCounts[r.type] = (resistanceCounts[r.type] || 0) + 1;
            }
          }
          
          const sortedWeaknesses = Object.entries(weaknessCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
          
          const sortedResistances = Object.entries(resistanceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
          
          return {
            teamSize: teamTypes.length,
            commonWeaknesses: sortedWeaknesses.map(([type, count]) => ({
              type: type.toUpperCase(),
              membersWeak: count,
              severity: count >= 3 ? 'CRITICAL' : count >= 2 ? 'Concerning' : 'Manageable'
            })),
            commonResistances: sortedResistances.map(([type, count]) => ({
              type: type.toUpperCase(),
              membersResist: count
            })),
            recommendation: sortedWeaknesses.length > 0 && sortedWeaknesses[0][1] >= 3
              ? `WARNING: ${sortedWeaknesses[0][1]} team members weak to ${sortedWeaknesses[0][0].toUpperCase()}. Consider adding a resist.`
              : 'Team has reasonable type balance'
          };
        }

        case 'coverage_check': {
          if (!attackingTypes?.length) {
            return { error: 'Need attackingTypes for coverage check' };
          }
          
          const types = attackingTypes.map(t => t.toLowerCase() as PokemonType);
          const allDefTypes = typeChart.types as PokemonType[];
          
          const coverage: Record<string, string> = {};
          const uncovered: string[] = [];
          
          for (const defType of allDefTypes) {
            let bestMult = 0;
            let bestAttack = '';
            
            for (const atkType of types) {
              const mult = getTypeEffectiveness(atkType, [defType]);
              if (mult > bestMult) {
                bestMult = mult;
                bestAttack = atkType;
              }
            }
            
            if (bestMult >= 2) {
              coverage[defType] = `${bestAttack.toUpperCase()} (${formatMultiplier(bestMult)})`;
            } else if (bestMult === 0) {
              uncovered.push(`${defType.toUpperCase()} (immune to ${types.join('/')})`);
            } else if (bestMult < 1) {
              uncovered.push(`${defType.toUpperCase()} (resists all)`);
            }
          }
          
          return {
            moveCoverage: attackingTypes.map(t => t.toUpperCase()),
            superEffectiveAgainst: Object.keys(coverage).map(t => t.toUpperCase()),
            coverageGaps: uncovered,
            coveragePercentage: `${Math.round((Object.keys(coverage).length / allDefTypes.length) * 100)}%`,
            recommendation: uncovered.length > 3
              ? `Consider adding coverage for: ${uncovered.slice(0, 3).join(', ')}`
              : 'Good offensive coverage!'
          };
        }

        default:
          return { error: 'Unknown analysis type' };
      }
    } catch (error) {
      console.error('Battle analysis error:', error);
      return { error: 'Failed to perform battle analysis' };
    }
  },
});
