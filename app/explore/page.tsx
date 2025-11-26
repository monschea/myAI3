"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Zap, Shield, Swords, Sparkles, BookOpen, ChevronRight, MessageCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const TYPES = Object.keys(TYPE_COLORS);

const GENERATIONS = [
  { gen: 1, region: "Kanto", pokemon: ["Bulbasaur", "Charmander", "Squirtle", "Pikachu", "Mewtwo"], color: "from-red-500 to-red-600" },
  { gen: 2, region: "Johto", pokemon: ["Chikorita", "Cyndaquil", "Totodile", "Lugia", "Ho-Oh"], color: "from-yellow-500 to-yellow-600" },
  { gen: 3, region: "Hoenn", pokemon: ["Treecko", "Torchic", "Mudkip", "Rayquaza", "Groudon"], color: "from-green-500 to-green-600" },
  { gen: 4, region: "Sinnoh", pokemon: ["Turtwig", "Chimchar", "Piplup", "Dialga", "Palkia"], color: "from-blue-500 to-blue-600" },
  { gen: 5, region: "Unova", pokemon: ["Snivy", "Tepig", "Oshawott", "Reshiram", "Zekrom"], color: "from-gray-600 to-gray-700" },
  { gen: 6, region: "Kalos", pokemon: ["Chespin", "Fennekin", "Froakie", "Xerneas", "Yveltal"], color: "from-pink-500 to-pink-600" },
  { gen: 7, region: "Alola", pokemon: ["Rowlet", "Litten", "Popplio", "Solgaleo", "Lunala"], color: "from-orange-500 to-orange-600" },
  { gen: 8, region: "Galar", pokemon: ["Grookey", "Scorbunny", "Sobble", "Zacian", "Zamazenta"], color: "from-purple-500 to-purple-600" },
  { gen: 9, region: "Paldea", pokemon: ["Sprigatito", "Fuecoco", "Quaxly", "Koraidon", "Miraidon"], color: "from-indigo-500 to-indigo-600" },
];

const FEATURED_POKEMON = [
  { name: "Charizard", types: ["fire", "flying"], role: "Special Sweeper", tier: "OU" },
  { name: "Garchomp", types: ["dragon", "ground"], role: "Physical Sweeper", tier: "OU" },
  { name: "Greninja", types: ["water", "dark"], role: "Protean Attacker", tier: "Uber" },
  { name: "Dragonite", types: ["dragon", "flying"], role: "Multiscale Sweeper", tier: "OU" },
  { name: "Tyranitar", types: ["rock", "dark"], role: "Sand Setter", tier: "OU" },
  { name: "Metagross", types: ["steel", "psychic"], role: "Physical Tank", tier: "UU" },
];

const MEGA_EVOLUTIONS = [
  { name: "Mega Charizard X", types: ["fire", "dragon"], ability: "Tough Claws" },
  { name: "Mega Charizard Y", types: ["fire", "flying"], ability: "Drought" },
  { name: "Mega Gengar", types: ["ghost", "poison"], ability: "Shadow Tag" },
  { name: "Mega Garchomp", types: ["dragon", "ground"], ability: "Sand Force" },
  { name: "Mega Lucario", types: ["fighting", "steel"], ability: "Adaptability" },
  { name: "Mega Salamence", types: ["dragon", "flying"], ability: "Aerilate" },
];

const LORE_CATEGORIES = [
  { title: "Legendary Pokémon", description: "Explore the myths of legendary creatures", icon: Sparkles, query: "Tell me about legendary Pokémon" },
  { title: "Mythical Pokémon", description: "Discover rare mythical beings", icon: BookOpen, query: "What are mythical Pokémon?" },
  { title: "Regional Forms", description: "Alolan, Galarian, Hisuian variants", icon: Shield, query: "Explain regional forms like Alolan and Galarian" },
  { title: "Battle Mechanics", description: "Terastallization, Mega Evolution, Z-Moves", icon: Zap, query: "How does Terastallization work?" },
];

const quickQueries = [
  "What are Charizard's weaknesses?",
  "Build me a team around Garchomp",
  "What beats Dragon/Steel types?",
  "Compare Salamence vs Dragonite",
  "Best counters for Fairy types",
  "Explain Terastallization strategy",
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem('pending-query', searchQuery);
      router.push('/');
    }
  };

  const handleQuickQuery = (query: string) => {
    localStorage.setItem('pending-query', query);
    router.push('/');
  };

  const handlePokemonClick = (name: string) => {
    localStorage.setItem('pending-query', `Tell me about ${name}`);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-orange-500">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-700 to-red-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-red-800">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-gray-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Pokémon Battle Assistant</h1>
              <p className="text-xs text-red-200">Ask me anything about Pokémon types, strategies, matchups & team building!</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 rounded-2xl p-8 mb-8 border-4 border-yellow-200 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-yellow-400">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Trainer! I'm your Pokémon Battle Assistant powered by AI. I can help you with:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span><strong className="text-yellow-600">Type matchups</strong> - Learn what's super effective against what</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Swords className="w-4 h-4 text-red-500" />
                  <span><strong className="text-red-600">Battle strategies</strong> - Get competitive Pokémon advice</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span><strong className="text-blue-600">Team building</strong> - Build balanced teams with good synergy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span><strong className="text-green-600">Pokémon stats & moves</strong> - Detailed info on any Pokémon</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span><strong className="text-purple-600">Competitive tiers</strong> - OU, UU, and more</span>
                </div>
              </div>
              <p className="text-gray-500 mt-4 italic">Try asking: "What are Charizard's weaknesses?" or "Build me a team around Garchomp"</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a Pokémon or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-6 text-lg bg-white border-2 border-red-300 text-gray-800 placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white"
            >
              Ask AI
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {quickQueries.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery(query)}
              className="bg-white/80 border-red-300 text-red-700 hover:bg-red-50"
            >
              {query}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="generations" className="w-full">
          <TabsList className="w-full justify-start bg-red-800/30 p-1 rounded-xl mb-6">
            <TabsTrigger value="generations" className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-white rounded-lg">
              Generations
            </TabsTrigger>
            <TabsTrigger value="types" className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-white rounded-lg">
              Types
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-white rounded-lg">
              Featured
            </TabsTrigger>
            <TabsTrigger value="mega" className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-white rounded-lg">
              Mega Forms
            </TabsTrigger>
            <TabsTrigger value="lore" className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-white rounded-lg">
              Lore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GENERATIONS.map((gen) => (
                <button
                  key={gen.gen}
                  onClick={() => handleQuickQuery(`Tell me about Generation ${gen.gen} Pokémon from ${gen.region}`)}
                  className="group bg-white rounded-xl p-5 border-2 border-transparent hover:border-red-400 transition-all text-left shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${gen.color} text-white text-sm font-bold`}>
                      Gen {gen.gen}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{gen.region}</h3>
                  <div className="flex flex-wrap gap-1">
                    {gen.pokemon.slice(0, 3).map((name) => (
                      <span key={name} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {name}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400">+more</span>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All 18 Pokémon Types</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleQuickQuery(`What are ${type} type's strengths and weaknesses?`)}
                    className="group flex flex-col items-center p-3 rounded-lg hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${TYPE_COLORS[type]}20` }}
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-white font-bold text-xs uppercase"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                    >
                      {type.slice(0, 3)}
                    </div>
                    <span className="text-xs font-medium text-gray-700 capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_POKEMON.map((pokemon) => (
                <button
                  key={pokemon.name}
                  onClick={() => handlePokemonClick(pokemon.name)}
                  className="group bg-white rounded-xl p-5 border-2 border-transparent hover:border-red-400 transition-all text-left shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{pokemon.name}</h3>
                    <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      {pokemon.tier}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs text-white px-2 py-1 rounded-full uppercase font-semibold"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{pokemon.role}</p>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mega">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEGA_EVOLUTIONS.map((mega) => (
                <button
                  key={mega.name}
                  onClick={() => handleQuickQuery(`Tell me about ${mega.name}`)}
                  className="group bg-white rounded-xl p-5 border-2 border-transparent hover:border-purple-400 transition-all text-left shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-bold text-gray-800">{mega.name}</h3>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {mega.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs text-white px-2 py-1 rounded-full uppercase font-semibold"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Ability: {mega.ability}</p>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lore">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LORE_CATEGORIES.map((category) => (
                <button
                  key={category.title}
                  onClick={() => handleQuickQuery(category.query)}
                  className="group bg-white rounded-xl p-6 border-2 border-transparent hover:border-blue-400 transition-all text-left shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-red-700 mt-12 py-6 bg-red-800/30">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-red-200">
          © {new Date().getFullYear()} Pokémon Battle Assistant by Mansha Kohli. Powered by AI.
        </div>
      </footer>
    </div>
  );
}
