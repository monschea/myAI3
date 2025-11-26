import { tool } from 'ai';
import { z } from 'zod';
import {
  findPokemon,
  comparePokemon,
  getMegaEvolution,
  getRegionalForm,
  getAllPokemonByGeneration,
  getAllPokemonByType,
  getAllLegendaries,
  getAllMegaEvolutions,
  getDefensiveProfile,
  suggestRole,
  formatMultiplier,
  generations,
  PokemonType
} from '@/lib/pokemon/data';

export const pokedexLookup = tool({
  description: 'Look up detailed Pokémon information including stats, abilities, evolution, lore, regional forms, and mega evolutions. Use for specific Pokémon queries.',
  inputSchema: z.object({
    queryType: z.enum([
      'pokemon_info',
      'regional_forms',
      'mega_evolutions',
      'gigantamax',
      'evolution_chain',
      'compare_pokemon',
      'generation_info',
      'legendary_list',
      'battle_strategy',
      'terastallization'
    ]).describe('Type of Pokédex query'),
    pokemonName: z.string().optional().describe('Name of the Pokémon to look up'),
    pokemonName2: z.string().optional().describe('Second Pokémon name for comparison'),
    region: z.enum(['alolan', 'galarian', 'hisuian', 'paldean']).optional().describe('Regional form to look up'),
    generation: z.number().optional().describe('Generation number (1-9)'),
    pokemonType: z.string().optional().describe('Type to filter by'),
  }),
  execute: async ({ queryType, pokemonName, pokemonName2, region, generation, pokemonType }) => {
    try {
      switch (queryType) {
        case 'pokemon_info': {
          if (!pokemonName) {
            return { error: 'Need pokemonName for info lookup' };
          }
          
          const pokemon = findPokemon(pokemonName);
          if (!pokemon) {
            return { error: `Pokémon "${pokemonName}" not found in database` };
          }
          
          const profile = getDefensiveProfile(pokemon.types as PokemonType[]);
          const role = suggestRole(pokemon);
          
          return {
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map(t => t.toUpperCase()),
            generation: pokemon.generation,
            stats: {
              ...pokemon.stats,
              statBias: pokemon.stats.attack > pokemon.stats.spAtk ? 'Physical' : 'Special'
            },
            abilities: {
              regular: pokemon.abilities.normal,
              hidden: pokemon.abilities.hidden || 'None'
            },
            evolution: pokemon.evolution ? {
              chain: pokemon.evolution.chain,
              method: pokemon.evolution.method || `Level ${pokemon.evolution.level}`,
              from: pokemon.evolution.from,
              to: pokemon.evolution.to
            } : 'Does not evolve',
            lore: pokemon.lore,
            competitive: {
              tier: pokemon.tier,
              role: role,
              hasMegaEvolution: pokemon.megaEvolution || false,
              hasGigantamax: pokemon.gigantamax || false,
              isLegendary: pokemon.legendary || false,
              isMythical: pokemon.mythical || false
            },
            typeMatchups: {
              weaknesses: profile.weaknesses.map(w => `${w.type.toUpperCase()} (${formatMultiplier(w.multiplier)})`),
              resistances: profile.resistances.map(r => `${r.type.toUpperCase()} (${formatMultiplier(r.multiplier)})`),
              immunities: profile.immunities.map(i => i.type.toUpperCase()),
              quadWeaknesses: profile.quadWeaknesses.map(w => w.type.toUpperCase())
            }
          };
        }

        case 'regional_forms': {
          if (!pokemonName || !region) {
            return { error: 'Need pokemonName and region for regional form lookup' };
          }
          
          const form = getRegionalForm(pokemonName, region);
          if (!form) {
            return { error: `No ${region} form found for ${pokemonName}` };
          }
          
          const originalPokemon = findPokemon(pokemonName);
          
          return {
            name: `${region.charAt(0).toUpperCase() + region.slice(1)} ${pokemonName}`,
            region: region.charAt(0).toUpperCase() + region.slice(1),
            types: form.types.map((t: string) => t.toUpperCase()),
            originalTypes: originalPokemon?.types.map(t => t.toUpperCase()) || [],
            stats: form.stats,
            specialAbility: form.ability || null,
            evolvesTo: form.evolvesTo || null,
            comparison: originalPokemon ? {
              typeChange: `${originalPokemon.types.join('/')} → ${form.types.join('/')}`,
              statChanges: Object.entries(form.stats).map(([stat, value]) => {
                const orig = originalPokemon.stats[stat as keyof typeof originalPokemon.stats];
                const diff = (value as number) - orig;
                return diff !== 0 ? `${stat}: ${diff > 0 ? '+' : ''}${diff}` : null;
              }).filter(Boolean)
            } : null
          };
        }

        case 'mega_evolutions': {
          if (pokemonName) {
            const mega = getMegaEvolution(pokemonName);
            if (!mega) {
              return { error: `No Mega Evolution found for ${pokemonName}` };
            }
            
            const basePokemon = findPokemon(pokemonName);
            
            return {
              name: `Mega ${pokemonName}`,
              types: mega.types.map((t: string) => t.toUpperCase()),
              stats: mega.stats,
              ability: mega.ability,
              statTotal: mega.stats.total,
              comparison: basePokemon ? {
                statBoost: mega.stats.total - basePokemon.stats.total,
                newAbility: mega.ability,
                typeChange: mega.types.join('/') !== basePokemon.types.join('/') 
                  ? `${basePokemon.types.join('/')} → ${mega.types.join('/')}`
                  : 'Same typing'
              } : null
            };
          } else {
            const allMegas = getAllMegaEvolutions();
            return {
              count: allMegas.length,
              megaEvolutions: allMegas.map(name => name.charAt(0).toUpperCase() + name.slice(1)),
              note: 'Use pokemonName parameter for detailed Mega Evolution info'
            };
          }
        }

        case 'evolution_chain': {
          if (!pokemonName) {
            return { error: 'Need pokemonName for evolution chain' };
          }
          
          const pokemon = findPokemon(pokemonName);
          if (!pokemon) {
            return { error: `Pokémon "${pokemonName}" not found` };
          }
          
          if (!pokemon.evolution) {
            return {
              pokemon: pokemon.name,
              evolutionChain: [pokemon.name],
              note: 'This Pokémon does not evolve'
            };
          }
          
          return {
            pokemon: pokemon.name,
            evolutionChain: pokemon.evolution.chain,
            currentStage: pokemon.evolution.chain.indexOf(pokemon.name) + 1,
            totalStages: pokemon.evolution.chain.length,
            evolvesFrom: pokemon.evolution.from || null,
            evolvesTo: pokemon.evolution.to || null,
            method: pokemon.evolution.method || (pokemon.evolution.level ? `Level ${pokemon.evolution.level}` : null)
          };
        }

        case 'compare_pokemon': {
          if (!pokemonName || !pokemonName2) {
            return { error: 'Need both pokemonName and pokemonName2 for comparison' };
          }
          
          const comparison = comparePokemon(pokemonName, pokemonName2);
          
          if (!comparison.pokemon1 || !comparison.pokemon2) {
            return { 
              error: `Could not find: ${!comparison.pokemon1 ? pokemonName : ''} ${!comparison.pokemon2 ? pokemonName2 : ''}`.trim()
            };
          }
          
          const p1 = comparison.pokemon1;
          const p2 = comparison.pokemon2;
          
          return {
            pokemon1: {
              name: p1.name,
              types: p1.types.map(t => t.toUpperCase()),
              tier: p1.tier,
              role: p1.role,
              bst: p1.stats.total
            },
            pokemon2: {
              name: p2.name,
              types: p2.types.map(t => t.toUpperCase()),
              tier: p2.tier,
              role: p2.role,
              bst: p2.stats.total
            },
            statComparison: comparison.statComparison,
            typeMatchup: {
              [`${p1.name} vs ${p2.name}`]: formatMultiplier(comparison.typeAdvantage.p1VsP2),
              [`${p2.name} vs ${p1.name}`]: formatMultiplier(comparison.typeAdvantage.p2VsP1),
              advantage: comparison.typeAdvantage.p1VsP2 > comparison.typeAdvantage.p2VsP1 
                ? p1.name 
                : comparison.typeAdvantage.p2VsP1 > comparison.typeAdvantage.p1VsP2 
                  ? p2.name 
                  : 'Even'
            },
            verdict: {
              higherBST: p1.stats.total > p2.stats.total ? p1.name : p2.stats.total > p1.stats.total ? p2.name : 'Equal',
              faster: p1.stats.speed > p2.stats.speed ? p1.name : p2.stats.speed > p1.stats.speed ? p2.name : 'Equal',
              bulkier: (p1.stats.hp + p1.stats.defense + p1.stats.spDef) > (p2.stats.hp + p2.stats.defense + p2.stats.spDef) ? p1.name : p2.name
            }
          };
        }

        case 'generation_info': {
          if (generation && generation >= 1 && generation <= 9) {
            const gen = generations[generation.toString() as keyof typeof generations];
            const pokemonList = getAllPokemonByGeneration(generation);
            
            return {
              generation: generation,
              region: gen.name,
              games: gen.games,
              starters: gen.starters,
              newPokemonCount: gen.count,
              samplePokemon: pokemonList.slice(0, 10).map(p => p.name)
            };
          } else {
            return {
              allGenerations: Object.entries(generations).map(([num, gen]) => ({
                generation: parseInt(num),
                region: gen.name,
                games: gen.games,
                count: gen.count
              }))
            };
          }
        }

        case 'legendary_list': {
          const legendaries = getAllLegendaries();
          
          return {
            count: legendaries.length,
            legendaries: legendaries.filter(p => p.legendary).map(p => ({
              name: p.name,
              types: p.types.map(t => t.toUpperCase()),
              generation: p.generation,
              bst: p.stats.total
            })),
            mythicals: legendaries.filter(p => p.mythical).map(p => ({
              name: p.name,
              types: p.types.map(t => t.toUpperCase()),
              generation: p.generation
            }))
          };
        }

        case 'battle_strategy': {
          if (!pokemonName) {
            return { error: 'Need pokemonName for battle strategy' };
          }
          
          const pokemon = findPokemon(pokemonName);
          if (!pokemon) {
            return { error: `Pokémon "${pokemonName}" not found` };
          }
          
          const profile = getDefensiveProfile(pokemon.types as PokemonType[]);
          const role = suggestRole(pokemon);
          const isPhysical = pokemon.stats.attack > pokemon.stats.spAtk;
          
          return {
            pokemon: pokemon.name,
            types: pokemon.types.map(t => t.toUpperCase()),
            tier: pokemon.tier,
            recommendedRole: role,
            statProfile: {
              offensiveBias: isPhysical ? 'Physical' : 'Special',
              mainStat: isPhysical ? `Attack: ${pokemon.stats.attack}` : `Sp. Atk: ${pokemon.stats.spAtk}`,
              speed: pokemon.stats.speed,
              speedTier: pokemon.stats.speed > 100 ? 'Fast' : pokemon.stats.speed > 70 ? 'Medium' : 'Slow',
              bulk: {
                physical: Math.floor((pokemon.stats.hp * 2 + pokemon.stats.defense) / 3),
                special: Math.floor((pokemon.stats.hp * 2 + pokemon.stats.spDef) / 3)
              }
            },
            abilities: {
              recommended: pokemon.abilities.hidden || pokemon.abilities.normal[0],
              options: [...pokemon.abilities.normal, pokemon.abilities.hidden].filter(Boolean)
            },
            threats: {
              quadWeaknesses: profile.quadWeaknesses.map(w => `${w.type.toUpperCase()} (CRITICAL - 4× damage)`),
              weaknesses: profile.weaknesses.filter(w => w.multiplier < 4).map(w => w.type.toUpperCase())
            },
            advantages: {
              resistances: profile.resistances.map(r => r.type.toUpperCase()),
              immunities: profile.immunities.map(i => i.type.toUpperCase())
            },
            strategyNotes: [
              isPhysical ? 'Focus on physical moves for STAB damage' : 'Focus on special moves for STAB damage',
              pokemon.stats.speed > 100 ? 'Can outspeed most unboosted threats' : 
                pokemon.stats.speed < 50 ? 'Consider Trick Room support' : 'May need Speed investment or priority moves',
              profile.quadWeaknesses.length > 0 ? `CRITICAL: Avoid ${profile.quadWeaknesses[0].type.toUpperCase()} attackers at all costs` : '',
              pokemon.abilities.hidden ? `Hidden Ability ${pokemon.abilities.hidden} may be competitively superior` : ''
            ].filter(Boolean)
          };
        }

        case 'terastallization': {
          return {
            mechanic: 'Terastallization',
            generation: 9,
            effect: 'Changes defensive type to Tera Type while keeping offensive STAB',
            benefits: [
              'Removes original weaknesses',
              'Gains STAB on Tera Type moves (2× if matching original type)',
              'Can surprise opponents with unexpected coverage'
            ],
            strategy: {
              offensive: 'Tera into a type that boosts your best coverage move',
              defensive: 'Tera into a type that removes key weaknesses',
              examples: [
                'Dragon → Steel: Removes Dragon/Ice/Fairy weaknesses',
                'Water → Grass: Gains resistance to Electric/Grass',
                'Fighting → Ghost: Gains immunity to Fighting counters'
              ]
            },
            competitiveNotes: 'Tera Type is hidden until used, adding mindgame element'
          };
        }

        default:
          return { error: 'Unknown query type' };
      }
    } catch (error) {
      console.error('Pokedex lookup error:', error);
      return { error: 'Failed to perform Pokédex lookup' };
    }
  },
});
