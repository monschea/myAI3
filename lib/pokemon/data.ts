import typeChartData from '@/data/pokemon/type-chart.json';
import abilitiesData from '@/data/pokemon/abilities.json';
import pokedexData from '@/data/pokemon/pokedex.json';
import regionalData from '@/data/pokemon/regional-forms.json';

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface TypeEffectiveness {
  type: PokemonType;
  multiplier: number;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  total: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  stats: PokemonStats;
  abilities: { normal: string[]; hidden: string | null };
  evolution: { from?: string; to?: string; method?: string; level?: number; chain: string[] } | null;
  lore: string;
  tier: string;
  role: string;
  generation: number;
  megaEvolution?: boolean;
  gigantamax?: boolean;
  legendary?: boolean;
  mythical?: boolean;
  regionalForm?: string;
}

export const typeChart = typeChartData;
export const abilities = abilitiesData.abilities;
export const pokedex = pokedexData.pokemon as Record<string, Pokemon>;
export const generations = pokedexData.generations;
export const regionalForms = regionalData.regionalForms;
export const megaEvolutions = regionalData.megaEvolutions;
export const gigantamaxForms = regionalData.gigantamaxForms;

export function getTypeEffectiveness(attackType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  const chart = typeChart.effectiveness[attackType];
  
  for (const defType of defenderTypes) {
    multiplier *= chart[defType] || 1;
  }
  
  return multiplier;
}

export function getDefensiveProfile(types: PokemonType[]): {
  weaknesses: TypeEffectiveness[];
  resistances: TypeEffectiveness[];
  immunities: TypeEffectiveness[];
  quadWeaknesses: TypeEffectiveness[];
} {
  const weaknesses: TypeEffectiveness[] = [];
  const resistances: TypeEffectiveness[] = [];
  const immunities: TypeEffectiveness[] = [];
  const quadWeaknesses: TypeEffectiveness[] = [];
  
  const allTypes = typeChart.types as PokemonType[];
  
  for (const attackType of allTypes) {
    const multiplier = getTypeEffectiveness(attackType, types);
    
    if (multiplier === 0) {
      immunities.push({ type: attackType, multiplier: 0 });
    } else if (multiplier >= 4) {
      quadWeaknesses.push({ type: attackType, multiplier });
      weaknesses.push({ type: attackType, multiplier });
    } else if (multiplier >= 2) {
      weaknesses.push({ type: attackType, multiplier });
    } else if (multiplier <= 0.5) {
      resistances.push({ type: attackType, multiplier });
    }
  }
  
  return { weaknesses, resistances, immunities, quadWeaknesses };
}

export function getOffensiveProfile(attackTypes: PokemonType[]): {
  superEffective: TypeEffectiveness[];
  notVeryEffective: TypeEffectiveness[];
  noEffect: TypeEffectiveness[];
} {
  const allTypes = typeChart.types as PokemonType[];
  const results: Record<string, number> = {};
  
  for (const defType of allTypes) {
    let bestMultiplier = 0;
    for (const atkType of attackTypes) {
      const mult = getTypeEffectiveness(atkType, [defType]);
      if (mult > bestMultiplier) bestMultiplier = mult;
    }
    results[defType] = bestMultiplier;
  }
  
  const superEffective: TypeEffectiveness[] = [];
  const notVeryEffective: TypeEffectiveness[] = [];
  const noEffect: TypeEffectiveness[] = [];
  
  for (const [type, mult] of Object.entries(results)) {
    if (mult === 0) {
      noEffect.push({ type: type as PokemonType, multiplier: 0 });
    } else if (mult >= 2) {
      superEffective.push({ type: type as PokemonType, multiplier: mult });
    } else if (mult < 1) {
      notVeryEffective.push({ type: type as PokemonType, multiplier: mult });
    }
  }
  
  return { superEffective, notVeryEffective, noEffect };
}

export function findPokemon(query: string): Pokemon | null {
  const normalized = query.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return pokedex[normalized] || null;
}

export function findAbility(name: string): typeof abilities[keyof typeof abilities] | null {
  const normalized = name.toLowerCase().replace(/[^a-z-]/g, '');
  return abilities[normalized as keyof typeof abilities] || null;
}

export function getCounters(types: PokemonType[]): { type: PokemonType; effectiveness: number }[] {
  const profile = getDefensiveProfile(types);
  const counters: { type: PokemonType; effectiveness: number }[] = [];
  
  for (const weakness of profile.quadWeaknesses) {
    counters.push({ type: weakness.type, effectiveness: 4 });
  }
  
  for (const weakness of profile.weaknesses) {
    if (weakness.multiplier < 4) {
      counters.push({ type: weakness.type, effectiveness: weakness.multiplier });
    }
  }
  
  return counters.sort((a, b) => b.effectiveness - a.effectiveness);
}

export function getBestAttackingTypes(defenderTypes: PokemonType[]): PokemonType[] {
  const counters = getCounters(defenderTypes);
  return counters.slice(0, 5).map(c => c.type);
}

export function getTypeColor(type: PokemonType): string {
  return typeChart.typeColors[type] || '#A8A878';
}

export function formatMultiplier(mult: number): string {
  if (mult === 0) return '0×';
  if (mult === 0.25) return '¼×';
  if (mult === 0.5) return '½×';
  if (mult === 1) return '1×';
  if (mult === 2) return '2×';
  if (mult === 4) return '4×';
  return `${mult}×`;
}

export function suggestRole(pokemon: Pokemon): string {
  const { stats, types, abilities: pokemonAbilities } = pokemon;
  
  const physicalBias = stats.attack > stats.spAtk;
  const bulky = (stats.hp + stats.defense + stats.spDef) / 3 > 80;
  const fast = stats.speed > 95;
  
  if (stats.speed > 100 && (stats.attack > 100 || stats.spAtk > 100)) {
    return physicalBias ? 'Physical Sweeper' : 'Special Sweeper';
  }
  
  if (bulky && stats.attack < 80 && stats.spAtk < 80) {
    return 'Wall/Support';
  }
  
  if (bulky && (stats.attack > 90 || stats.spAtk > 90)) {
    return 'Bulky Attacker';
  }
  
  if (fast && !bulky) {
    return 'Revenge Killer';
  }
  
  return pokemon.role || 'Flexible';
}

export function getMegaEvolution(pokemonName: string): typeof megaEvolutions[keyof typeof megaEvolutions] | null {
  const normalized = pokemonName.toLowerCase();
  return megaEvolutions[normalized as keyof typeof megaEvolutions] || null;
}

export function getRegionalForm(pokemonName: string, region: 'alolan' | 'galarian' | 'hisuian' | 'paldean'): any {
  const normalized = pokemonName.toLowerCase();
  const forms = regionalForms[region]?.pokemon;
  return forms?.[normalized as keyof typeof forms] || null;
}

export function getAllPokemonByGeneration(gen: number): Pokemon[] {
  return Object.values(pokedex).filter(p => p.generation === gen);
}

export function getAllPokemonByType(type: PokemonType): Pokemon[] {
  return Object.values(pokedex).filter(p => p.types.includes(type));
}

export function getAllLegendaries(): Pokemon[] {
  return Object.values(pokedex).filter(p => p.legendary || p.mythical);
}

export function getAllMegaEvolutions(): string[] {
  return Object.keys(megaEvolutions);
}

export function comparePokemon(name1: string, name2: string): {
  pokemon1: Pokemon | null;
  pokemon2: Pokemon | null;
  statComparison: Record<string, { p1: number; p2: number; winner: string }>;
  typeAdvantage: { p1VsP2: number; p2VsP1: number };
} {
  const p1 = findPokemon(name1);
  const p2 = findPokemon(name2);
  
  if (!p1 || !p2) {
    return { pokemon1: p1, pokemon2: p2, statComparison: {}, typeAdvantage: { p1VsP2: 1, p2VsP1: 1 } };
  }
  
  const statComparison: Record<string, { p1: number; p2: number; winner: string }> = {};
  const statKeys = ['hp', 'attack', 'defense', 'spAtk', 'spDef', 'speed', 'total'] as const;
  
  for (const key of statKeys) {
    const v1 = p1.stats[key];
    const v2 = p2.stats[key];
    statComparison[key] = {
      p1: v1,
      p2: v2,
      winner: v1 > v2 ? p1.name : v2 > v1 ? p2.name : 'Tie'
    };
  }
  
  let p1VsP2 = 1;
  let p2VsP1 = 1;
  
  for (const t of p1.types) {
    const mult = getTypeEffectiveness(t, p2.types);
    if (mult > p1VsP2) p1VsP2 = mult;
  }
  
  for (const t of p2.types) {
    const mult = getTypeEffectiveness(t, p1.types);
    if (mult > p2VsP1) p2VsP1 = mult;
  }
  
  return {
    pokemon1: p1,
    pokemon2: p2,
    statComparison,
    typeAdvantage: { p1VsP2, p2VsP1 }
  };
}
