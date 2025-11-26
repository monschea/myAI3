export * from './types';
export * from './data';

import { 
  PokemonType, 
  getTypeMatchupSummary, 
  getDefensiveProfile, 
  findDualTypeCounters,
  analyzeMatchup,
  getOffensiveProfile 
} from './types';
import { 
  getBattleStrategyTemplate, 
  analyzeTeamSynergy, 
  getAbilityInfo,
  findPriorityMovesByType,
  getPriorityMoves,
  getSpeedControlMoves
} from './data';

export interface PokemonLookupResult {
  query: string;
  queryType: 'type_matchup' | 'pokemon_info' | 'ability' | 'strategy' | 'counter';
  result: string;
  metadata?: Record<string, unknown>;
}

export function lookupTypeMatchup(
  attackerType: PokemonType | null,
  defenderTypes: PokemonType[]
): PokemonLookupResult {
  if (attackerType) {
    const analysis = analyzeMatchup(attackerType, defenderTypes);
    const defensiveProfile = getDefensiveProfile(defenderTypes);
    
    return {
      query: `${attackerType} vs ${defenderTypes.join('/')}`,
      queryType: 'type_matchup',
      result: `
## Type Matchup: ${attackerType.toUpperCase()} vs ${defenderTypes.map(t => t.toUpperCase()).join('/')}

**Effectiveness:** ${analysis.description}
**Multiplier:** ${analysis.effectiveness}x

### Recommendation
${analysis.recommendation}

### Full Defensive Profile
${defenderTypes.length > 0 ? getTypeMatchupSummary(defenderTypes) : 'No types specified'}
      `.trim(),
      metadata: {
        effectiveness: analysis.effectiveness,
        defensiveProfile
      }
    };
  }
  
  return {
    query: defenderTypes.join('/'),
    queryType: 'type_matchup',
    result: getTypeMatchupSummary(defenderTypes),
    metadata: {
      defensiveProfile: getDefensiveProfile(defenderTypes)
    }
  };
}

export function lookupCounters(types: PokemonType[]): PokemonLookupResult {
  const counters = findDualTypeCounters(types);
  const defensive = getDefensiveProfile(types);
  
  const lines: string[] = [];
  lines.push(`## Counter Analysis: ${types.map(t => t.toUpperCase()).join('/')}`);
  lines.push('');
  
  lines.push('### Best Attacking Types (Super Effective)');
  if (counters.bestAttackingTypes.length > 0) {
    for (const counter of counters.bestAttackingTypes) {
      lines.push(`- **${counter.type.toUpperCase()}** (${counter.effectiveness}x damage)`);
    }
  } else {
    lines.push('No types deal super-effective damage');
  }
  lines.push('');
  
  lines.push('### Types to Avoid (Resisted/Immune)');
  if (counters.worstMatchups.length > 0) {
    for (const bad of counters.worstMatchups) {
      const desc = bad.effectiveness === 0 ? 'immune' : `${bad.effectiveness}x`;
      lines.push(`- **${bad.type.toUpperCase()}** (${desc})`);
    }
  } else {
    lines.push('No major resistances');
  }
  lines.push('');
  
  if (defensive.immunities.length > 0) {
    lines.push('### Immunities (Cannot be hit by)');
    lines.push(defensive.immunities.map(t => t.toUpperCase()).join(', '));
    lines.push('');
  }
  
  lines.push('### Battle Recommendations');
  if (counters.bestAttackingTypes.length > 0) {
    const top = counters.bestAttackingTypes[0];
    lines.push(`- Lead with **${top.type.toUpperCase()}** type moves for ${top.effectiveness}x damage`);
  }
  if (defensive.weaknesses.length > 0) {
    const worst = defensive.weaknesses[0];
    lines.push(`- Watch out for **${worst.type.toUpperCase()}** attacks (${worst.multiplier}x damage taken)`);
  }
  
  return {
    query: types.join('/'),
    queryType: 'counter',
    result: lines.join('\n'),
    metadata: {
      bestCounters: counters.bestAttackingTypes,
      avoid: counters.worstMatchups,
      immunities: defensive.immunities
    }
  };
}

export function lookupBattleStrategy(
  types: PokemonType[],
  ability: string
): PokemonLookupResult {
  const template = getBattleStrategyTemplate(types, ability);
  const abilityInfo = getAbilityInfo(ability);
  const counters = findDualTypeCounters(types);
  const defensive = getDefensiveProfile(types);
  
  const lines: string[] = [];
  lines.push(template);
  lines.push('');
  
  lines.push('### Offensive STAB Options');
  for (const type of types) {
    const offensive = getOffensiveProfile(type);
    lines.push(`**${type.toUpperCase()}:** Super effective vs ${offensive.superEffective.join(', ') || 'none'}`);
  }
  lines.push('');
  
  lines.push('### Defensive Considerations');
  if (defensive.weaknesses.length > 0) {
    lines.push(`**Weaknesses:** ${defensive.weaknesses.map(w => `${w.type} (${w.multiplier}x)`).join(', ')}`);
  }
  if (defensive.resistances.length > 0) {
    lines.push(`**Resistances:** ${defensive.resistances.map(r => `${r.type} (${r.multiplier}x)`).join(', ')}`);
  }
  if (defensive.immunities.length > 0) {
    lines.push(`**Immunities:** ${defensive.immunities.join(', ')}`);
  }
  lines.push('');
  
  lines.push('### Recommended Team Support');
  if (counters.bestAttackingTypes.length > 0) {
    const threats = counters.bestAttackingTypes.slice(0, 3).map(t => t.type);
    lines.push(`Pair with Pokémon that resist: ${threats.join(', ')}`);
  }
  
  return {
    query: `${types.join('/')} with ${ability}`,
    queryType: 'strategy',
    result: lines.join('\n'),
    metadata: {
      ability: abilityInfo,
      counters: counters.bestAttackingTypes.slice(0, 5)
    }
  };
}

export function lookupAbility(abilityName: string): PokemonLookupResult {
  const info = getAbilityInfo(abilityName);
  
  if (!info) {
    return {
      query: abilityName,
      queryType: 'ability',
      result: `No detailed information found for ability "${abilityName}". This may be a less common ability.`
    };
  }
  
  const lines: string[] = [];
  lines.push(`## Ability: ${abilityName}`);
  lines.push(`**Category:** ${info.category.charAt(0).toUpperCase() + info.category.slice(1)}`);
  lines.push('');
  
  const details = info.details as Record<string, unknown>;
  
  if (details.effect) {
    lines.push(`**Effect:** ${details.effect}`);
  }
  
  if (details.synergies && Array.isArray(details.synergies)) {
    lines.push(`**Synergizes with:** ${details.synergies.join(', ')}`);
  }
  
  if (details.boosts && typeof details.boosts === 'object') {
    const boostList = Object.entries(details.boosts as Record<string, number>)
      .map(([type, mult]) => `${type}: ${mult}x`);
    lines.push(`**Boosts:** ${boostList.join(', ')}`);
  }
  
  if (details.enables && Array.isArray(details.enables)) {
    lines.push(`**Enables:** ${details.enables.join(', ')}`);
  }
  
  if (details.prevents && Array.isArray(details.prevents)) {
    lines.push(`**Prevents:** ${details.prevents.join(', ')}`);
  }
  
  if (details.best_for) {
    lines.push(`**Best for:** ${details.best_for}`);
  }
  
  return {
    query: abilityName,
    queryType: 'ability',
    result: lines.join('\n'),
    metadata: { info }
  };
}

export function lookupPriorityMoves(type?: PokemonType): PokemonLookupResult {
  const lines: string[] = [];
  
  if (type) {
    const moves = findPriorityMovesByType(type);
    lines.push(`## Priority Moves: ${type.toUpperCase()}`);
    lines.push('');
    
    if (moves.length > 0) {
      for (const move of moves) {
        const powerStr = move.power ? ` | ${move.power} BP` : '';
        lines.push(`### ${move.name} (Priority +${move.priority}${powerStr})`);
        lines.push(`**Category:** ${move.category}`);
        if (move.effect) lines.push(`**Effect:** ${move.effect}`);
        lines.push('');
      }
    } else {
      lines.push(`No priority moves found for ${type} type.`);
    }
  } else {
    const allPriority = getPriorityMoves();
    lines.push('## Priority Move Reference');
    lines.push('');
    
    for (const [priority, moves] of Object.entries(allPriority).sort((a, b) => 
      parseInt(b[0]) - parseInt(a[0])
    )) {
      lines.push(`### Priority ${priority}`);
      for (const move of moves) {
        const powerStr = 'power' in move && move.power ? ` (${move.power} BP)` : '';
        lines.push(`- **${move.name}**${powerStr} [${move.type}/${move.category}]: ${move.effect || 'No effect'}`);
      }
      lines.push('');
    }
  }
  
  return {
    query: type ? `${type} priority` : 'all priority moves',
    queryType: 'strategy',
    result: lines.join('\n')
  };
}

export function lookupSpeedControl(): PokemonLookupResult {
  const speedControl = getSpeedControlMoves();
  
  const lines: string[] = [];
  lines.push('## Speed Control Options');
  lines.push('');
  
  for (const [name, data] of Object.entries(speedControl)) {
    const formattedName = name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    lines.push(`### ${formattedName}`);
    lines.push(`**Effect:** ${data.effect}`);
    lines.push(`**Priority:** ${data.priority}`);
    lines.push('');
  }
  
  lines.push('### Strategic Notes');
  lines.push('- **Tailwind** is best for naturally fast teams');
  lines.push('- **Trick Room** reverses Speed, best for slow powerhouses');
  lines.push('- **Icy Wind/Electroweb** provide immediate speed drops');
  lines.push('- **Paralysis** is permanent but can be healed');
  
  return {
    query: 'speed control',
    queryType: 'strategy',
    result: lines.join('\n')
  };
}
