import typeChart from '@/data/pokemon/type-chart.json';

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface TypeEffectiveness {
  multiplier: number;
  description: string;
}

export interface DefensiveProfile {
  weaknesses: { type: PokemonType; multiplier: number }[];
  resistances: { type: PokemonType; multiplier: number }[];
  immunities: PokemonType[];
  neutralTypes: PokemonType[];
}

export interface OffensiveProfile {
  superEffective: PokemonType[];
  notVeryEffective: PokemonType[];
  noEffect: PokemonType[];
  neutral: PokemonType[];
}

export interface MatchupAnalysis {
  attackerType: PokemonType;
  defenderTypes: PokemonType[];
  effectiveness: number;
  description: string;
  recommendation: string;
}

export function getTypeEffectiveness(attackType: PokemonType, defendType: PokemonType): number {
  const chart = typeChart.effectiveness as Record<string, Record<string, number>>;
  return chart[attackType]?.[defendType] ?? 1;
}

export function getDualTypeEffectiveness(attackType: PokemonType, defenderTypes: PokemonType[]): number {
  if (defenderTypes.length === 0) return 1;
  
  let multiplier = 1;
  for (const defType of defenderTypes) {
    multiplier *= getTypeEffectiveness(attackType, defType);
  }
  return multiplier;
}

export function getEffectivenessDescription(multiplier: number): string {
  if (multiplier === 0) return "No effect (immune)";
  if (multiplier === 0.25) return "Barely effective (0.25x)";
  if (multiplier === 0.5) return "Not very effective (0.5x)";
  if (multiplier === 1) return "Normal effectiveness (1x)";
  if (multiplier === 2) return "Super effective (2x)";
  if (multiplier === 4) return "Extremely effective (4x)";
  return `${multiplier}x effectiveness`;
}

export function getDefensiveProfile(types: PokemonType[]): DefensiveProfile {
  const allTypes = typeChart.types as PokemonType[];
  const weaknesses: { type: PokemonType; multiplier: number }[] = [];
  const resistances: { type: PokemonType; multiplier: number }[] = [];
  const immunities: PokemonType[] = [];
  const neutralTypes: PokemonType[] = [];

  for (const attackType of allTypes) {
    const multiplier = getDualTypeEffectiveness(attackType, types);
    
    if (multiplier === 0) {
      immunities.push(attackType);
    } else if (multiplier > 1) {
      weaknesses.push({ type: attackType, multiplier });
    } else if (multiplier < 1) {
      resistances.push({ type: attackType, multiplier });
    } else {
      neutralTypes.push(attackType);
    }
  }

  weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  resistances.sort((a, b) => a.multiplier - b.multiplier);

  return { weaknesses, resistances, immunities, neutralTypes };
}

export function getOffensiveProfile(type: PokemonType): OffensiveProfile {
  const allTypes = typeChart.types as PokemonType[];
  const superEffective: PokemonType[] = [];
  const notVeryEffective: PokemonType[] = [];
  const noEffect: PokemonType[] = [];
  const neutral: PokemonType[] = [];

  for (const defType of allTypes) {
    const multiplier = getTypeEffectiveness(type, defType);
    
    if (multiplier === 0) {
      noEffect.push(defType);
    } else if (multiplier > 1) {
      superEffective.push(defType);
    } else if (multiplier < 1) {
      notVeryEffective.push(defType);
    } else {
      neutral.push(defType);
    }
  }

  return { superEffective, notVeryEffective, noEffect, neutral };
}

export function analyzeMatchup(attackerType: PokemonType, defenderTypes: PokemonType[]): MatchupAnalysis {
  const effectiveness = getDualTypeEffectiveness(attackerType, defenderTypes);
  const description = getEffectivenessDescription(effectiveness);
  
  let recommendation: string;
  if (effectiveness >= 2) {
    recommendation = `${attackerType.toUpperCase()} is a strong choice against ${defenderTypes.join('/')}. Consider leading with this type.`;
  } else if (effectiveness === 0) {
    recommendation = `${attackerType.toUpperCase()} has no effect on ${defenderTypes.join('/')}. Avoid using this type entirely.`;
  } else if (effectiveness < 1) {
    recommendation = `${attackerType.toUpperCase()} is resisted by ${defenderTypes.join('/')}. Consider alternative coverage.`;
  } else {
    recommendation = `${attackerType.toUpperCase()} deals neutral damage to ${defenderTypes.join('/')}. Acceptable but not optimal.`;
  }

  return {
    attackerType,
    defenderTypes,
    effectiveness,
    description,
    recommendation
  };
}

export function findBestCoverage(defenderTypes: PokemonType[]): { type: PokemonType; effectiveness: number }[] {
  const allTypes = typeChart.types as PokemonType[];
  const coverage: { type: PokemonType; effectiveness: number }[] = [];

  for (const attackType of allTypes) {
    const effectiveness = getDualTypeEffectiveness(attackType, defenderTypes);
    coverage.push({ type: attackType, effectiveness });
  }

  return coverage.sort((a, b) => b.effectiveness - a.effectiveness);
}

export function findDualTypeCounters(types: PokemonType[]): {
  bestAttackingTypes: { type: PokemonType; effectiveness: number }[];
  worstMatchups: { type: PokemonType; effectiveness: number }[];
} {
  const coverage = findBestCoverage(types);
  
  return {
    bestAttackingTypes: coverage.filter(c => c.effectiveness >= 2),
    worstMatchups: coverage.filter(c => c.effectiveness <= 0.5)
  };
}

export function getTypeMatchupSummary(types: PokemonType[]): string {
  const defensive = getDefensiveProfile(types);
  const counters = findDualTypeCounters(types);
  
  const lines: string[] = [];
  lines.push(`## Type Analysis: ${types.map(t => t.toUpperCase()).join('/')}`);
  lines.push('');
  
  if (defensive.immunities.length > 0) {
    lines.push(`**Immunities:** ${defensive.immunities.join(', ')}`);
  }
  
  if (defensive.weaknesses.length > 0) {
    const weakStr = defensive.weaknesses.map(w => 
      `${w.type} (${w.multiplier}x)`
    ).join(', ');
    lines.push(`**Weaknesses:** ${weakStr}`);
  }
  
  if (defensive.resistances.length > 0) {
    const resStr = defensive.resistances.map(r => 
      `${r.type} (${r.multiplier}x)`
    ).join(', ');
    lines.push(`**Resistances:** ${resStr}`);
  }
  
  lines.push('');
  lines.push(`**Best Attacking Types:** ${counters.bestAttackingTypes.map(t => t.type).join(', ') || 'None with super-effective damage'}`);
  
  return lines.join('\n');
}

export function getAllTypes(): PokemonType[] {
  return typeChart.types as PokemonType[];
}
