import fs from 'fs';
import path from 'path';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const OUTPUT_DIR = path.join(process.cwd(), 'data/pokemon');

interface PokeAPISpecies {
  id: number;
  name: string;
  generation: { name: string };
  flavor_text_entries: { flavor_text: string; language: { name: string }; version: { name: string } }[];
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
  evolution_chain: { url: string };
  evolves_from_species: { name: string } | null;
}

interface PokeAPIPokemon {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean; slot: number }[];
  stats: { base_stat: number; stat: { name: string } }[];
  forms: { name: string; url: string }[];
}

interface PokeAPIEvolutionChain {
  chain: EvolutionNode;
}

interface EvolutionNode {
  species: { name: string };
  evolution_details: { min_level: number | null; trigger: { name: string }; item?: { name: string } }[];
  evolves_to: EvolutionNode[];
}

interface PokemonRecord {
  id: number;
  name: string;
  displayName: string;
  types: string[];
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
  generation: number;
  lore: string;
  evolutionInfo: {
    from: string | null;
    trigger: string | null;
    level: number | null;
  };
  forms: {
    name: string;
    types: string[];
    isMega: boolean;
    isRegional: boolean;
    region: string | null;
  }[];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<unknown> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1));
    }
  }
  throw new Error('Max retries reached');
}

function extractGeneration(genName: string): number {
  const match = genName.match(/generation-([ivxlc]+)/i);
  if (!match) return 1;
  
  const romanNumerals: Record<string, number> = {
    'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
    'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9
  };
  return romanNumerals[match[1].toLowerCase()] || 1;
}

function formatName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractLore(entries: PokeAPISpecies['flavor_text_entries']): string {
  const english = entries.find(e => e.language.name === 'en');
  if (!english) return '';
  return english.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim();
}

async function fetchPokemonData(id: number): Promise<PokemonRecord | null> {
  try {
    console.log(`Fetching Pokémon #${id}...`);
    
    const speciesUrl = `${POKEAPI_BASE}/pokemon-species/${id}`;
    const pokemonUrl = `${POKEAPI_BASE}/pokemon/${id}`;
    
    const [speciesData, pokemonData] = await Promise.all([
      fetchWithRetry(speciesUrl) as Promise<PokeAPISpecies>,
      fetchWithRetry(pokemonUrl) as Promise<PokeAPIPokemon>
    ]);
    
    const stats = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0
    };
    
    for (const stat of pokemonData.stats) {
      const statName = stat.stat.name;
      const value = stat.base_stat;
      
      if (statName === 'hp') stats.hp = value;
      else if (statName === 'attack') stats.attack = value;
      else if (statName === 'defense') stats.defense = value;
      else if (statName === 'special-attack') stats.specialAttack = value;
      else if (statName === 'special-defense') stats.specialDefense = value;
      else if (statName === 'speed') stats.speed = value;
    }
    stats.total = stats.hp + stats.attack + stats.defense + 
                  stats.specialAttack + stats.specialDefense + stats.speed;
    
    const normalAbilities: string[] = [];
    let hiddenAbility: string | null = null;
    
    for (const ab of pokemonData.abilities) {
      const abilityName = formatName(ab.ability.name);
      if (ab.is_hidden) {
        hiddenAbility = abilityName;
      } else {
        normalAbilities.push(abilityName);
      }
    }
    
    const forms: PokemonRecord['forms'] = [];
    for (const variety of speciesData.varieties) {
      if (!variety.is_default) {
        const formName = variety.pokemon.name;
        const isMega = formName.includes('-mega');
        const isRegional = formName.includes('-alola') || formName.includes('-galar') || 
                          formName.includes('-hisui') || formName.includes('-paldea');
        
        let region: string | null = null;
        if (formName.includes('-alola')) region = 'Alola';
        else if (formName.includes('-galar')) region = 'Galar';
        else if (formName.includes('-hisui')) region = 'Hisui';
        else if (formName.includes('-paldea')) region = 'Paldea';
        
        try {
          const formData = await fetchWithRetry(variety.pokemon.url) as PokeAPIPokemon;
          forms.push({
            name: formatName(formName),
            types: formData.types.map(t => t.type.name),
            isMega,
            isRegional,
            region
          });
        } catch {
          forms.push({
            name: formatName(formName),
            types: pokemonData.types.map(t => t.type.name),
            isMega,
            isRegional,
            region
          });
        }
      }
    }
    
    return {
      id: speciesData.id,
      name: speciesData.name,
      displayName: formatName(speciesData.name),
      types: pokemonData.types.map(t => t.type.name),
      abilities: {
        normal: normalAbilities,
        hidden: hiddenAbility
      },
      stats,
      generation: extractGeneration(speciesData.generation.name),
      lore: extractLore(speciesData.flavor_text_entries),
      evolutionInfo: {
        from: speciesData.evolves_from_species?.name || null,
        trigger: null,
        level: null
      },
      forms
    };
  } catch (error) {
    console.error(`Failed to fetch Pokémon #${id}:`, error);
    return null;
  }
}

async function fetchAllPokemon(startId: number = 1, endId: number = 151): Promise<void> {
  const allPokemon: PokemonRecord[] = [];
  
  for (let id = startId; id <= endId; id++) {
    const pokemon = await fetchPokemonData(id);
    if (pokemon) {
      allPokemon.push(pokemon);
    }
    await delay(100);
  }
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const outputPath = path.join(OUTPUT_DIR, 'pokedex.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPokemon, null, 2));
  console.log(`Saved ${allPokemon.length} Pokémon to ${outputPath}`);
}

function generateNarrativeSummary(pokemon: PokemonRecord): string {
  const lines: string[] = [];
  
  lines.push(`# ${pokemon.displayName} (#${pokemon.id})`);
  lines.push('');
  lines.push(`**Types:** ${pokemon.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('/')}`);
  lines.push(`**Generation:** ${pokemon.generation}`);
  lines.push('');
  
  lines.push('## Abilities');
  lines.push(`**Regular Abilities:** ${pokemon.abilities.normal.join(', ')}`);
  if (pokemon.abilities.hidden) {
    lines.push(`**Hidden Ability:** ${pokemon.abilities.hidden}`);
  }
  lines.push('');
  
  lines.push('## Base Stats');
  lines.push(`- HP: ${pokemon.stats.hp}`);
  lines.push(`- Attack: ${pokemon.stats.attack}`);
  lines.push(`- Defense: ${pokemon.stats.defense}`);
  lines.push(`- Sp. Attack: ${pokemon.stats.specialAttack}`);
  lines.push(`- Sp. Defense: ${pokemon.stats.specialDefense}`);
  lines.push(`- Speed: ${pokemon.stats.speed}`);
  lines.push(`- **Total:** ${pokemon.stats.total}`);
  lines.push('');
  
  if (pokemon.lore) {
    lines.push('## Pokédex Entry');
    lines.push(pokemon.lore);
    lines.push('');
  }
  
  if (pokemon.forms.length > 0) {
    lines.push('## Alternate Forms');
    for (const form of pokemon.forms) {
      let formDesc = `- **${form.name}**`;
      if (form.isMega) formDesc += ' (Mega Evolution)';
      if (form.isRegional && form.region) formDesc += ` (${form.region} Form)`;
      formDesc += `: ${form.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('/')}`;
      lines.push(formDesc);
    }
    lines.push('');
  }
  
  if (pokemon.evolutionInfo.from) {
    lines.push('## Evolution');
    lines.push(`Evolves from: ${formatName(pokemon.evolutionInfo.from)}`);
    lines.push('');
  }
  
  return lines.join('\n');
}

async function generateNarratives(): Promise<void> {
  const pokedexPath = path.join(OUTPUT_DIR, 'pokedex.json');
  
  if (!fs.existsSync(pokedexPath)) {
    console.log('Pokedex not found. Fetching data first...');
    await fetchAllPokemon();
  }
  
  const pokedex: PokemonRecord[] = JSON.parse(fs.readFileSync(pokedexPath, 'utf-8'));
  const narratives: { id: number; name: string; content: string }[] = [];
  
  for (const pokemon of pokedex) {
    narratives.push({
      id: pokemon.id,
      name: pokemon.name,
      content: generateNarrativeSummary(pokemon)
    });
  }
  
  const outputPath = path.join(OUTPUT_DIR, 'narratives.json');
  fs.writeFileSync(outputPath, JSON.stringify(narratives, null, 2));
  console.log(`Generated ${narratives.length} narrative summaries`);
}

const args = process.argv.slice(2);
const command = args[0] || 'all';

if (command === 'fetch') {
  const start = parseInt(args[1]) || 1;
  const end = parseInt(args[2]) || 151;
  fetchAllPokemon(start, end);
} else if (command === 'narratives') {
  generateNarratives();
} else if (command === 'all') {
  fetchAllPokemon(1, 151).then(() => generateNarratives());
}

export { fetchAllPokemon, generateNarratives };
export type { PokemonRecord };
