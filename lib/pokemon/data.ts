import priorityMoves from '@/data/pokemon/priority-moves.json';
import abilitySynergies from '@/data/pokemon/ability-synergies.json';
import pokedexData from '@/data/pokemon/pokedex.json';
import regionalFormsData from '@/data/pokemon/regional-forms.json';
import { PokemonType, getDefensiveProfile, getOffensiveProfile } from './types';

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

export interface PokedexEntry {
  id: number;
  name: string;
  types: PokemonType[];
  generation: number;
  category?: string;
  height?: number;
  weight?: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    total: number;
  };
  abilities: {
    normal: string[];
    hidden: string | null;
  };
  evolution?: {
    stage: number;
    chain: string[];
    previous?: { pokemon: string; method: string };
    next?: { pokemon: string; method: string };
  };
  megaEvolution?: {
    name: string;
    types: PokemonType[];
    ability: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
      total: number;
    };
  };
  megaEvolutions?: Array<{
    name: string;
    types: PokemonType[];
    ability: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
      total: number;
    };
  }>;
  forms?: Array<{
    name: string;
    types?: PokemonType[];
    ability?: string;
    stats?: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
    };
  }>;
  specialForms?: Array<{
    name: string;
    ability: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
      total: number;
    };
  }>;
  lore?: string;
  competitiveTier?: string;
  isLegendary?: boolean;
  isMythical?: boolean;
}

export interface RegionalFormData {
  originalTypes: PokemonType[];
  regionalTypes: PokemonType[];
  abilities: {
    normal: string[];
    hidden: string | null;
  };
  lore: string;
  evolutionNote?: string;
  isLegendary?: boolean;
}

const pokemon = pokedexData.pokemon as Record<string, PokedexEntry>;

export function lookupPokemon(name: string): PokedexEntry | null {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (pokemon[normalized]) {
    return pokemon[normalized];
  }
  
  for (const [key, entry] of Object.entries(pokemon)) {
    if (entry.name.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized) {
      return entry;
    }
  }
  
  return null;
}

export function searchPokemonByType(types: PokemonType[]): PokedexEntry[] {
  return Object.values(pokemon).filter(p => 
    types.every(t => p.types.includes(t))
  );
}

export function searchPokemonByGeneration(gen: number): PokedexEntry[] {
  return Object.values(pokemon).filter(p => p.generation === gen);
}

export function getPokemonWithMegaEvolution(): PokedexEntry[] {
  return Object.values(pokemon).filter(p => p.megaEvolution || p.megaEvolutions);
}

export function getRegionalForm(pokemonName: string, region: string): RegionalFormData | null {
  const normalized = pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const regionNormalized = region.toLowerCase();
  
  const regions = regionalFormsData.regionalForms as Record<string, {
    region: string;
    generation: number;
    pokemon: Record<string, RegionalFormData>;
  }>;
  
  if (regions[regionNormalized]?.pokemon[normalized]) {
    return regions[regionNormalized].pokemon[normalized];
  }
  
  return null;
}

export function getAllRegionalForms(pokemonName: string): Array<{region: string; form: RegionalFormData}> {
  const normalized = pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const forms: Array<{region: string; form: RegionalFormData}> = [];
  
  const regions = regionalFormsData.regionalForms as Record<string, {
    region: string;
    generation: number;
    pokemon: Record<string, RegionalFormData>;
  }>;
  
  for (const [regionKey, regionData] of Object.entries(regions)) {
    if (regionData.pokemon[normalized]) {
      forms.push({
        region: regionData.region,
        form: regionData.pokemon[normalized]
      });
    }
  }
  
  return forms;
}

export function getMegaEvolutionInfo(): typeof regionalFormsData.megaEvolutions {
  return regionalFormsData.megaEvolutions;
}

export function getGigantamaxInfo(): typeof regionalFormsData.gigantamax {
  return regionalFormsData.gigantamax;
}

export function getTerastallizationInfo(): typeof regionalFormsData.terastallization {
  return regionalFormsData.terastallization;
}

export function getEvolutionChain(pokemonName: string): string[] | null {
  const entry = lookupPokemon(pokemonName);
  if (!entry?.evolution?.chain) return null;
  return entry.evolution.chain;
}

export function formatPokemonEntry(entry: PokedexEntry): string {
  const lines: string[] = [];
  
  lines.push(`## ${entry.name} (#${entry.id})`);
  lines.push(`**Type:** ${entry.types.map(t => t.toUpperCase()).join('/')}`);
  lines.push(`**Generation:** ${entry.generation}`);
  if (entry.category) lines.push(`**Category:** ${entry.category}`);
  lines.push('');
  
  lines.push('### Base Stats');
  lines.push(`- HP: ${entry.stats.hp}`);
  lines.push(`- Attack: ${entry.stats.attack}`);
  lines.push(`- Defense: ${entry.stats.defense}`);
  lines.push(`- Sp. Attack: ${entry.stats.specialAttack}`);
  lines.push(`- Sp. Defense: ${entry.stats.specialDefense}`);
  lines.push(`- Speed: ${entry.stats.speed}`);
  lines.push(`- **Total:** ${entry.stats.total}`);
  lines.push('');
  
  lines.push('### Abilities');
  lines.push(`**Normal:** ${entry.abilities.normal.join(', ')}`);
  if (entry.abilities.hidden) {
    lines.push(`**Hidden Ability:** ${entry.abilities.hidden}`);
  }
  lines.push('');
  
  if (entry.evolution) {
    lines.push('### Evolution');
    lines.push(`**Chain:** ${entry.evolution.chain.join(' → ')}`);
    if (entry.evolution.previous) {
      lines.push(`**Evolves from:** ${entry.evolution.previous.pokemon} (${entry.evolution.previous.method})`);
    }
    if (entry.evolution.next) {
      lines.push(`**Evolves into:** ${entry.evolution.next.pokemon} (${entry.evolution.next.method})`);
    }
    lines.push('');
  }
  
  if (entry.megaEvolution) {
    lines.push('### Mega Evolution');
    lines.push(`**${entry.megaEvolution.name}**`);
    lines.push(`- Type: ${entry.megaEvolution.types.map(t => t.toUpperCase()).join('/')}`);
    lines.push(`- Ability: ${entry.megaEvolution.ability}`);
    lines.push(`- BST: ${entry.megaEvolution.stats.total}`);
    lines.push('');
  }
  
  if (entry.megaEvolutions) {
    lines.push('### Mega Evolutions');
    for (const mega of entry.megaEvolutions) {
      lines.push(`**${mega.name}**`);
      lines.push(`- Type: ${mega.types.map(t => t.toUpperCase()).join('/')}`);
      lines.push(`- Ability: ${mega.ability}`);
      lines.push(`- BST: ${mega.stats.total}`);
    }
    lines.push('');
  }
  
  if (entry.forms && entry.forms.length > 0) {
    lines.push('### Alternate Forms');
    for (const form of entry.forms) {
      const typeStr = form.types ? form.types.map(t => t.toUpperCase()).join('/') : 'Same';
      lines.push(`- **${form.name}**: ${typeStr}${form.ability ? `, ${form.ability}` : ''}`);
    }
    lines.push('');
  }
  
  const defensiveProfile = getDefensiveProfile(entry.types);
  lines.push('### Type Matchups');
  if (defensiveProfile.weaknesses.length > 0) {
    const weakStr = defensiveProfile.weaknesses.map(w => `${w.type} (${w.multiplier}x)`).join(', ');
    lines.push(`**Weaknesses:** ${weakStr}`);
  }
  if (defensiveProfile.resistances.length > 0) {
    const resStr = defensiveProfile.resistances.map(r => `${r.type} (${r.multiplier}x)`).join(', ');
    lines.push(`**Resistances:** ${resStr}`);
  }
  if (defensiveProfile.immunities.length > 0) {
    lines.push(`**Immunities:** ${defensiveProfile.immunities.join(', ')}`);
  }
  lines.push('');
  
  if (entry.lore) {
    lines.push('### Pokédex Entry');
    lines.push(entry.lore);
    lines.push('');
  }
  
  if (entry.competitiveTier) {
    lines.push(`**Competitive Tier:** ${entry.competitiveTier}`);
  }
  if (entry.isLegendary) lines.push('*This is a Legendary Pokémon*');
  if (entry.isMythical) lines.push('*This is a Mythical Pokémon*');
  
  return lines.join('\n');
}

export function formatRegionalForm(pokemonName: string, region: string, form: RegionalFormData): string {
  const lines: string[] = [];
  
  lines.push(`## ${region} ${pokemonName}`);
  lines.push(`**Original Type:** ${form.originalTypes.map(t => t.toUpperCase()).join('/')}`);
  lines.push(`**Regional Type:** ${form.regionalTypes.map(t => t.toUpperCase()).join('/')}`);
  lines.push('');
  
  lines.push('### Abilities');
  lines.push(`**Normal:** ${form.abilities.normal.join(', ')}`);
  if (form.abilities.hidden) {
    lines.push(`**Hidden Ability:** ${form.abilities.hidden}`);
  }
  lines.push('');
  
  const defensiveProfile = getDefensiveProfile(form.regionalTypes as PokemonType[]);
  lines.push('### Type Matchups');
  if (defensiveProfile.weaknesses.length > 0) {
    const weakStr = defensiveProfile.weaknesses.map(w => `${w.type} (${w.multiplier}x)`).join(', ');
    lines.push(`**Weaknesses:** ${weakStr}`);
  }
  if (defensiveProfile.resistances.length > 0) {
    const resStr = defensiveProfile.resistances.map(r => `${r.type} (${r.multiplier}x)`).join(', ');
    lines.push(`**Resistances:** ${resStr}`);
  }
  if (defensiveProfile.immunities.length > 0) {
    lines.push(`**Immunities:** ${defensiveProfile.immunities.join(', ')}`);
  }
  lines.push('');
  
  if (form.evolutionNote) {
    lines.push(`**Evolution Note:** ${form.evolutionNote}`);
    lines.push('');
  }
  
  lines.push('### Pokédex Entry');
  lines.push(form.lore);
  
  return lines.join('\n');
}

export function generateBattleStrategy(pokemonName: string): string {
  const entry = lookupPokemon(pokemonName);
  if (!entry) return `Pokémon "${pokemonName}" not found in database.`;
  
  const lines: string[] = [];
  lines.push(`## Battle Strategy: ${entry.name}`);
  lines.push('');
  
  const defensive = getDefensiveProfile(entry.types);
  const isPhysical = entry.stats.attack > entry.stats.specialAttack;
  const isFast = entry.stats.speed >= 100;
  const isBulky = (entry.stats.hp + entry.stats.defense + entry.stats.specialDefense) / 3 >= 90;
  
  lines.push('### Role Analysis');
  const roles: string[] = [];
  if (isPhysical && isFast) roles.push('Physical Sweeper');
  if (!isPhysical && isFast) roles.push('Special Sweeper');
  if (isBulky && !isFast) roles.push('Tank/Wall');
  if (entry.stats.speed < 50 && entry.stats.attack >= 100) roles.push('Trick Room Sweeper');
  if (entry.abilities.hidden && ['Regenerator', 'Intimidate'].includes(entry.abilities.hidden)) roles.push('Pivot');
  lines.push(`**Suggested Roles:** ${roles.length > 0 ? roles.join(', ') : 'Versatile'}`);
  lines.push('');
  
  lines.push('### Offensive Profile');
  for (const type of entry.types) {
    const offensive = getOffensiveProfile(type);
    lines.push(`**${type.toUpperCase()} STAB:**`);
    lines.push(`- Super Effective vs: ${offensive.superEffective.join(', ') || 'None'}`);
    if (offensive.noEffect.length > 0) {
      lines.push(`- No Effect on: ${offensive.noEffect.join(', ')}`);
    }
  }
  lines.push('');
  
  lines.push('### Defensive Considerations');
  if (defensive.weaknesses.length > 0) {
    const quadWeak = defensive.weaknesses.filter(w => w.multiplier >= 4);
    if (quadWeak.length > 0) {
      lines.push(`**4x Weaknesses (CRITICAL):** ${quadWeak.map(w => w.type).join(', ')}`);
    }
    const doubleWeak = defensive.weaknesses.filter(w => w.multiplier === 2);
    if (doubleWeak.length > 0) {
      lines.push(`**2x Weaknesses:** ${doubleWeak.map(w => w.type).join(', ')}`);
    }
  }
  if (defensive.immunities.length > 0) {
    lines.push(`**Immunities:** ${defensive.immunities.join(', ')}`);
  }
  lines.push('');
  
  lines.push('### Priority Move Coverage');
  const priorityByType: Record<string, MoveData[]> = {};
  for (const type of entry.types) {
    const moves = findPriorityMovesByType(type);
    if (moves.length > 0) {
      priorityByType[type] = moves;
    }
  }
  
  if (Object.keys(priorityByType).length > 0) {
    for (const [type, moves] of Object.entries(priorityByType)) {
      lines.push(`**${type.toUpperCase()} Priority:**`);
      for (const move of moves.slice(0, 3)) {
        lines.push(`- ${move.name} (+${move.priority}): ${move.effect || 'Standard priority attack'}`);
      }
    }
  } else {
    lines.push('No STAB priority moves available.');
  }
  lines.push('');
  
  if (entry.abilities.hidden) {
    const abilityInfo = getAbilityInfo(entry.abilities.hidden);
    if (abilityInfo) {
      lines.push('### Hidden Ability Strategy');
      lines.push(`**${entry.abilities.hidden}** (${abilityInfo.category})`);
      if ('effect' in abilityInfo.details) {
        lines.push(`Effect: ${abilityInfo.details.effect}`);
      }
    }
  }
  
  return lines.join('\n');
}

export function getAllPokemonNames(): string[] {
  return Object.values(pokemon).map(p => p.name);
}

export function getPokemonCount(): number {
  return Object.keys(pokemon).length;
}
