import priorityMoves from '@/data/pokemon/priority-moves.json';
import abilitySynergies from '@/data/pokemon/ability-synergies.json';
import { PokemonType } from './types';

export interface PokemonData {
  id: number;
  name: string;
  types: PokemonType[];
  abilities: {
    normal: string[];
    hidden: string | null;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    total: number;
  };
  evolution?: {
    from?: string;
    to?: string[];
    method?: string;
    level?: number;
  };
  forms?: {
    name: string;
    types: PokemonType[];
    isMega?: boolean;
    isRegional?: boolean;
    region?: string;
  }[];
  generation: number;
  lore?: string;
}

export interface MoveData {
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power?: number;
  accuracy?: number;
  priority: number;
  effect?: string;
}

export interface AbilityData {
  name: string;
  effect: string;
  isHidden: boolean;
  synergies?: string[];
}

export function getPriorityMoves(): typeof priorityMoves.priority_moves {
  return priorityMoves.priority_moves;
}

export function getSpeedControlMoves(): typeof priorityMoves.speed_control {
  return priorityMoves.speed_control;
}

export function getWeatherAbilities(): typeof abilitySynergies.weather_abilities {
  return abilitySynergies.weather_abilities;
}

export function getTerrainAbilities(): typeof abilitySynergies.terrain_abilities {
  return abilitySynergies.terrain_abilities;
}

export function getOffensiveAbilities(): typeof abilitySynergies.offensive_abilities {
  return abilitySynergies.offensive_abilities;
}

export function getDefensiveAbilities(): typeof abilitySynergies.defensive_abilities {
  return abilitySynergies.defensive_abilities;
}

export function getSpeedAbilities(): typeof abilitySynergies.speed_abilities {
  return abilitySynergies.speed_abilities;
}

export function getAbilitySynergyCombos(): typeof abilitySynergies.combo_synergies {
  return abilitySynergies.combo_synergies;
}

export function findPriorityMovesByType(type: PokemonType): MoveData[] {
  const moves: MoveData[] = [];
  const allPriority = priorityMoves.priority_moves;
  
  for (const [priority, moveList] of Object.entries(allPriority)) {
    for (const move of moveList) {
      if (move.type === type) {
        moves.push({
          name: move.name,
          type: move.type as PokemonType,
          category: move.category as 'physical' | 'special' | 'status',
          power: 'power' in move ? move.power : undefined,
          priority: parseInt(priority),
          effect: move.effect
        });
      }
    }
  }
  
  return moves.sort((a, b) => b.priority - a.priority);
}

export function getAbilityInfo(abilityName: string): {
  category: string;
  details: Record<string, unknown>;
} | null {
  const normalizedName = abilityName.toLowerCase().replace(/\s+/g, '_');
  
  const categories = [
    { name: 'weather', data: abilitySynergies.weather_abilities },
    { name: 'terrain', data: abilitySynergies.terrain_abilities },
    { name: 'offensive', data: abilitySynergies.offensive_abilities },
    { name: 'defensive', data: abilitySynergies.defensive_abilities },
    { name: 'speed', data: abilitySynergies.speed_abilities },
  ];

  for (const category of categories) {
    if (normalizedName in category.data) {
      return {
        category: category.name,
        details: (category.data as Record<string, Record<string, unknown>>)[normalizedName]
      };
    }
  }
  
  return null;
}

export function suggestAbilitySynergies(abilityName: string): string[] {
  const info = getAbilityInfo(abilityName);
  if (!info) return [];
  
  if ('synergies' in info.details && Array.isArray(info.details.synergies)) {
    return info.details.synergies;
  }
  
  return [];
}

export function getBattleStrategyTemplate(pokemonTypes: PokemonType[], ability: string): string {
  const abilityInfo = getAbilityInfo(ability);
  const priorityOptions = pokemonTypes.flatMap(t => findPriorityMovesByType(t));
  
  const lines: string[] = [];
  lines.push('## Battle Strategy Analysis');
  lines.push('');
  
  if (abilityInfo) {
    lines.push(`### Ability: ${ability} (${abilityInfo.category})`);
    if ('effect' in abilityInfo.details) {
      lines.push(`**Effect:** ${abilityInfo.details.effect}`);
    }
    const synergies = suggestAbilitySynergies(ability);
    if (synergies.length > 0) {
      lines.push(`**Synergizes with:** ${synergies.join(', ')}`);
    }
    lines.push('');
  }
  
  if (priorityOptions.length > 0) {
    lines.push('### Priority Move Options:');
    for (const move of priorityOptions.slice(0, 5)) {
      const powerStr = move.power ? ` (${move.power} BP)` : '';
      lines.push(`- **${move.name}**${powerStr} - Priority +${move.priority}: ${move.effect || 'No special effect'}`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

export interface TeamSynergyAnalysis {
  weatherSynergy: string | null;
  terrainSynergy: string | null;
  abilityCombos: string[];
  recommendations: string[];
}

export function analyzeTeamSynergy(abilities: string[]): TeamSynergyAnalysis {
  const weatherAbilities = Object.keys(abilitySynergies.weather_abilities);
  const terrainAbilities = Object.keys(abilitySynergies.terrain_abilities);
  
  let weatherSynergy: string | null = null;
  let terrainSynergy: string | null = null;
  const abilityCombos: string[] = [];
  const recommendations: string[] = [];
  
  for (const ability of abilities) {
    const normalized = ability.toLowerCase().replace(/\s+/g, '_');
    
    if (weatherAbilities.includes(normalized)) {
      weatherSynergy = normalized;
      const weatherData = (abilitySynergies.weather_abilities as Record<string, { synergies?: string[] }>)[normalized];
      if (weatherData?.synergies) {
        const matchingSynergies = abilities.filter(a => 
          weatherData.synergies?.includes(a.toLowerCase().replace(/\s+/g, '_'))
        );
        if (matchingSynergies.length > 0) {
          abilityCombos.push(`${ability} + ${matchingSynergies.join(', ')}`);
        }
      }
    }
    
    if (terrainAbilities.includes(normalized)) {
      terrainSynergy = normalized;
    }
  }
  
  for (const combo of abilitySynergies.combo_synergies) {
    const matchCount = combo.abilities.filter(a => 
      abilities.some(ab => ab.toLowerCase().replace(/\s+/g, '_') === a)
    ).length;
    
    if (matchCount >= 2) {
      recommendations.push(`${combo.name}: ${combo.strategy}`);
    }
  }
  
  return { weatherSynergy, terrainSynergy, abilityCombos, recommendations };
}
