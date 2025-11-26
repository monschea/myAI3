"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Zap, Shield, Swords, Sparkles, BookOpen, ChevronRight, MessageCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-stone-500",
  ghost: "bg-purple-700",
  dragon: "bg-violet-600",
  dark: "bg-stone-700",
  steel: "bg-slate-400",
  fairy: "bg-pink-300",
};

const GENERATIONS = [
  { gen: 1, name: "Kanto", pokemon: ["Charizard", "Pikachu", "Mewtwo", "Dragonite", "Gengar"], range: "001-151" },
  { gen: 2, name: "Johto", pokemon: ["Tyranitar", "Scizor", "Espeon", "Umbreon"], range: "152-251" },
  { gen: 3, name: "Hoenn", pokemon: ["Blaziken", "Salamence", "Metagross", "Gardevoir"], range: "252-386" },
  { gen: 4, name: "Sinnoh", pokemon: ["Garchomp", "Lucario", "Togekiss", "Weavile"], range: "387-493" },
  { gen: 5, name: "Unova", pokemon: ["Volcarona", "Excadrill", "Hydreigon", "Ferrothorn"], range: "494-649" },
  { gen: 6, name: "Kalos", pokemon: ["Greninja", "Aegislash", "Sylveon", "Goodra"], range: "650-721" },
  { gen: 7, name: "Alola", pokemon: ["Mimikyu", "Toxapex", "Tapu Koko", "Decidueye"], range: "722-809" },
  { gen: 8, name: "Galar", pokemon: ["Dragapult", "Cinderace", "Zacian", "Urshifu"], range: "810-905" },
  { gen: 9, name: "Paldea", pokemon: ["Koraidon", "Miraidon", "Gholdengo", "Kingambit"], range: "906-1025" },
];

const FEATURED_POKEMON = [
  { name: "Charizard", types: ["fire", "flying"], description: "The iconic Fire/Flying starter with two Mega Evolutions" },
  { name: "Garchomp", types: ["dragon", "ground"], description: "A fierce Dragon/Ground sweeper dominating competitive play" },
  { name: "Mewtwo", types: ["psychic"], description: "The legendary Psychic powerhouse with unmatched Special Attack" },
  { name: "Tyranitar", types: ["rock", "dark"], description: "The pseudo-legendary that summons Sandstorm with Sand Stream" },
  { name: "Greninja", types: ["water", "dark"], description: "The versatile ninja with Protean and Battle Bond abilities" },
  { name: "Dragapult", types: ["dragon", "ghost"], description: "The fastest Dragon-type with exceptional offensive presence" },
];

const MEGA_POKEMON = [
  { name: "Mega Charizard X", types: ["fire", "dragon"], ability: "Tough Claws" },
  { name: "Mega Charizard Y", types: ["fire", "flying"], ability: "Drought" },
  { name: "Mega Garchomp", types: ["dragon", "ground"], ability: "Sand Force" },
  { name: "Mega Mewtwo X", types: ["psychic", "fighting"], ability: "Steadfast" },
  { name: "Mega Mewtwo Y", types: ["psychic"], ability: "Insomnia" },
  { name: "Mega Lucario", types: ["fighting", "steel"], ability: "Adaptability" },
  { name: "Mega Salamence", types: ["dragon", "flying"], ability: "Aerilate" },
  { name: "Mega Rayquaza", types: ["dragon", "flying"], ability: "Delta Stream" },
];

const QUICK_QUERIES = [
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative">
                <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-800 -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-800 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Pokemon Battle Assistant</h1>
              <p className="text-red-100 text-sm">Ask me anything about Pokemon types, strategies, matchups & team building!</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-amber-50 border-amber-200 mb-8 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                P
              </div>
              <div>
                <p className="text-lg mb-4">Welcome, Trainer! I'm your Pokemon Battle Assistant powered by AI. I can help you with:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <span><strong className="text-yellow-600">Type matchups</strong> - Learn what's super effective against what</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Swords className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong className="text-red-600">Battle strategies</strong> - Get competitive Pokemon advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong className="text-blue-600">Team building</strong> - Build balanced teams with good synergy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BookOpen className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span><strong className="text-green-600">Pokemon stats & moves</strong> - Detailed info on any Pokemon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <span><strong className="text-purple-600">Competitive tiers</strong> - OU, UU, and more</span>
                  </li>
                </ul>
                <p className="mt-4 text-gray-600 italic">
                  Try asking: "What are Charizard's weaknesses?" or "Build me a team around Garchomp"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a Pokémon or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-24 h-14 text-lg rounded-full bg-white shadow-lg border-2 border-red-200 focus:border-red-400"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-red-500 hover:bg-red-600"
            >
              Ask AI
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {QUICK_QUERIES.map((query, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white border-red-200 text-gray-700 hover:text-red-600"
              onClick={() => handleQuickQuery(query)}
            >
              {query}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="generations" className="w-full">
          <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-5 mb-6 bg-white/20">
            <TabsTrigger value="generations" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-600">
              Generations
            </TabsTrigger>
            <TabsTrigger value="types" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-600">
              Types
            </TabsTrigger>
            <TabsTrigger value="featured" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-600">
              Featured
            </TabsTrigger>
            <TabsTrigger value="mega" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-600">
              Mega Forms
            </TabsTrigger>
            <TabsTrigger value="lore" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-600">
              Lore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GENERATIONS.map((gen) => (
                <Card 
                  key={gen.gen} 
                  className="bg-white/95 hover:bg-white cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handleQuickQuery(`Tell me about Generation ${gen.gen} Pokemon from ${gen.name}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>Generation {gen.gen}</span>
                      <Badge variant="secondary">{gen.range}</Badge>
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-red-600">{gen.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {gen.pokemon.map((p) => (
                        <Badge 
                          key={p} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePokemonClick(p);
                          }}
                        >
                          {p}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>Explore region</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <Card 
                  key={type}
                  className={`${color} cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-0`}
                  onClick={() => handleQuickQuery(`What are the strengths and weaknesses of ${type} type Pokemon?`)}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-white font-bold capitalize text-lg drop-shadow-md">{type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleQuickQuery("Show me the complete type effectiveness chart")}
                className="gap-2"
              >
                <Zap className="w-5 h-5" />
                View Full Type Chart
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_POKEMON.map((pokemon) => (
                <Card 
                  key={pokemon.name}
                  className="bg-white/95 hover:bg-white cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
                  onClick={() => handlePokemonClick(pokemon.name)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>{pokemon.name}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-2">
                      {pokemon.types.map((type) => (
                        <Badge key={type} className={`${TYPE_COLORS[type]} text-white capitalize`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{pokemon.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mega">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MEGA_POKEMON.map((pokemon) => (
                <Card 
                  key={pokemon.name}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-purple-200"
                  onClick={() => handleQuickQuery(`Tell me about ${pokemon.name}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pokemon.name}</CardTitle>
                    <CardDescription className="font-medium text-purple-600">{pokemon.ability}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1">
                      {pokemon.types.map((type) => (
                        <Badge key={type} className={`${TYPE_COLORS[type]} text-white capitalize`}>
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleQuickQuery("List all Mega Evolutions and their abilities")}
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                View All Mega Evolutions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="lore">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Legendary Pokemon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Mewtwo", "Rayquaza", "Arceus", "Zacian", "Koraidon"].map((name) => (
                    <Button 
                      key={name}
                      variant="ghost" 
                      className="w-full justify-start hover:bg-blue-50"
                      onClick={() => handlePokemonClick(name)}
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Mythical Pokemon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Mew", "Celebi", "Jirachi", "Deoxys", "Darkrai"].map((name) => (
                    <Button 
                      key={name}
                      variant="ghost" 
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={() => handlePokemonClick(name)}
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Regional Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {["Alolan", "Galarian", "Hisuian", "Paldean"].map((region) => (
                      <Button 
                        key={region}
                        variant="outline" 
                        className="hover:bg-green-50"
                        onClick={() => handleQuickQuery(`Tell me about ${region} regional forms`)}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Battle Mechanics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {["Mega Evolution", "Gigantamax", "Terastallization", "Z-Moves"].map((mechanic) => (
                      <Button 
                        key={mechanic}
                        variant="outline" 
                        className="hover:bg-yellow-50 justify-start"
                        onClick={() => handleQuickQuery(`Explain ${mechanic} mechanics`)}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        {mechanic}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 border-0 shadow-xl">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to battle?</h3>
                <p className="text-yellow-100">Ask me anything about Pokemon strategies, matchups, or team building!</p>
              </div>
              <Link href="/">
                <Button size="lg" variant="secondary" className="gap-2 text-lg">
                  <MessageCircle className="w-5 h-5" />
                  Start Chatting
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-red-800 text-red-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>Pokemon Battle Assistant - Powered by AI</p>
          <p className="text-sm mt-2 text-red-200">
            Pokemon and all related names are trademarks of Nintendo/Game Freak.
          </p>
        </div>
      </footer>
    </div>
  );
}
