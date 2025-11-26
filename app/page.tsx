"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageWall } from "@/components/messages/message-wall";
import { useEffect, useState, useRef } from "react";
import { AI_NAME } from "@/config";
import { 
  Search, Zap, Shield, Swords, BookOpen, 
  Trash2, ArrowUp, Loader2, MessageCircle, Trophy, BarChart3
} from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const TYPES = Object.keys(TYPE_COLORS);

const QUICK_QUERIES = [
  "What are Charizard's weaknesses?",
  "Build me a team around Garchomp",
  "What beats Dragon/Steel types?",
  "Compare Salamence vs Dragonite",
  "Best counters for Fairy types",
  "Explain Terastallization strategy",
];

const FEATURED_POKEMON = [
  { name: "Charizard", types: ["fire", "flying"], tier: "OU" },
  { name: "Garchomp", types: ["dragon", "ground"], tier: "OU" },
  { name: "Greninja", types: ["water", "dark"], tier: "Uber" },
  { name: "Dragonite", types: ["dragon", "flying"], tier: "OU" },
  { name: "Tyranitar", types: ["rock", "dark"], tier: "OU" },
  { name: "Gengar", types: ["ghost", "poison"], tier: "OU" },
];

const TABS = ["Generations", "Types", "Featured", "Mega Forms", "Lore"];

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("Types");
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, mounted]);

  useEffect(() => {
    if (mounted) {
      const pendingQuery = localStorage.getItem("pending-query");
      if (pendingQuery) {
        localStorage.removeItem("pending-query");
        sendMessage({ parts: [{ type: "text", text: pendingQuery }] });
      }
    }
  }, [mounted, sendMessage]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage({ parts: [{ type: "text", text: inputValue }] });
      setInputValue("");
    }
  };

  const handleQuickQuery = (query: string) => {
    sendMessage({ parts: [{ type: "text", text: query }] });
  };

  const handlePokemonClick = (name: string) => {
    sendMessage({ parts: [{ type: "text", text: `Tell me about ${name}` }] });
  };

  const handleTypeClick = (type: string) => {
    sendMessage({ parts: [{ type: "text", text: `What are ${type} type's strengths and weaknesses?` }] });
  };

  const clearChat = () => {
    setMessages([]);
    setShowChat(false);
  };

  const startChat = () => {
    setShowChat(true);
  };

  const isLoading = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-orange-500 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600 flex flex-col">
      {/* Header */}
      <header className="bg-red-600 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-4 border-red-400">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{AI_NAME}</h1>
              <p className="text-xs text-red-200">Ask me anything about Pokémon types, strategies, matchups & team building!</p>
            </div>
          </div>
          {(showChat || hasMessages) ? (
            <Button 
              onClick={clearChat}
              className="bg-white text-red-600 hover:bg-red-50 rounded-full px-4"
            >
              <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" />
              Back
            </Button>
          ) : (
            <Button 
              onClick={startChat}
              className="bg-white text-red-600 hover:bg-red-50 rounded-full px-4"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-4">
        {/* Chat Mode */}
        {(showChat || hasMessages) ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            <div className="flex-1 overflow-y-auto p-4">
              {hasMessages ? (
                <div className="flex justify-center">
                  <MessageWall messages={messages} />
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Start a conversation by typing below...
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 bg-white p-4">
              <form onSubmit={onSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for a Pokémon or ask a question..."
                    className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 focus:border-red-400 focus:ring-red-400 rounded-full"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 rounded-full"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ask AI"
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Discovery Mode */
          <div className="space-y-4">
            {/* Welcome Card */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-2xl font-bold text-white">P</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Welcome, Trainer! I'm your Pokémon Battle Assistant powered by AI.
                  </h2>
                  <p className="text-gray-700 font-medium mb-3">I can help you with:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span><span className="text-green-600 font-semibold">Type matchups</span> - Learn what's super effective against what</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Swords className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><span className="text-red-600 font-semibold">Battle strategies</span> - Get competitive Pokémon advice</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span><span className="text-blue-600 font-semibold">Team building</span> - Build balanced teams with good synergy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span><span className="text-purple-600 font-semibold">Pokémon stats & moves</span> - Detailed info on any Pokémon</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Trophy className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span><span className="text-amber-600 font-semibold">Competitive tiers</span> - OU, UU, and more</span>
                    </div>
                  </div>
                  <p className="text-gray-500 italic text-sm">
                    Try asking: "What are Charizard's weaknesses?" or "Build me a team around Garchomp"
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <form onSubmit={onSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for a Pokémon or ask a question..."
                    className="pl-12 pr-4 py-4 bg-gray-50 border-gray-200 focus:border-red-400 focus:ring-red-400 rounded-full text-base"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 rounded-full text-base"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ask AI"
                  )}
                </Button>
              </form>
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_QUERIES.map((query) => (
                <button
                  key={query}
                  onClick={() => handleQuickQuery(query)}
                  className="px-4 py-2 text-sm bg-white/90 hover:bg-white text-red-700 rounded-full border border-red-200 transition-colors shadow-sm"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-yellow-400 text-gray-800"
                      : "bg-red-500/50 text-white hover:bg-red-500/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              {activeTab === "Types" && (
                <div className="grid grid-cols-6 gap-2">
                  {TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeClick(type)}
                      className="flex flex-col items-center p-2 rounded-lg hover:scale-105 transition-transform"
                      style={{ backgroundColor: `${TYPE_COLORS[type]}15` }}
                    >
                      <div
                        className="w-10 h-10 rounded-full mb-1 flex items-center justify-center text-white text-xs font-bold uppercase"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      >
                        {type.slice(0, 3)}
                      </div>
                      <span className="text-xs text-gray-600 capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "Featured" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FEATURED_POKEMON.map((pokemon) => (
                    <button
                      key={pokemon.name}
                      onClick={() => handlePokemonClick(pokemon.name)}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{pokemon.name}</span>
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {pokemon.tier}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            className="text-xs text-white px-2 py-0.5 rounded uppercase font-medium"
                            style={{ backgroundColor: TYPE_COLORS[type] }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "Generations" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Gen 1 - Kanto", range: "#001-151" },
                    { name: "Gen 2 - Johto", range: "#152-251" },
                    { name: "Gen 3 - Hoenn", range: "#252-386" },
                    { name: "Gen 4 - Sinnoh", range: "#387-493" },
                    { name: "Gen 5 - Unova", range: "#494-649" },
                    { name: "Gen 6 - Kalos", range: "#650-721" },
                    { name: "Gen 7 - Alola", range: "#722-809" },
                    { name: "Gen 8 - Galar", range: "#810-905" },
                    { name: "Gen 9 - Paldea", range: "#906-1025" },
                  ].map((gen) => (
                    <button
                      key={gen.name}
                      onClick={() => handleQuickQuery(`Tell me about ${gen.name} Pokémon`)}
                      className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100 hover:shadow-md transition-all text-left"
                    >
                      <span className="font-semibold text-gray-800 block">{gen.name}</span>
                      <span className="text-sm text-gray-500">{gen.range}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "Mega Forms" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Mega Charizard X", types: ["fire", "dragon"] },
                    { name: "Mega Charizard Y", types: ["fire", "flying"] },
                    { name: "Mega Gengar", types: ["ghost", "poison"] },
                    { name: "Mega Lucario", types: ["fighting", "steel"] },
                    { name: "Mega Garchomp", types: ["dragon", "ground"] },
                    { name: "Mega Mewtwo Y", types: ["psychic"] },
                  ].map((pokemon) => (
                    <button
                      key={pokemon.name}
                      onClick={() => handleQuickQuery(`Tell me about ${pokemon.name}`)}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-all text-left"
                    >
                      <span className="font-semibold text-gray-800 block mb-1">{pokemon.name}</span>
                      <div className="flex gap-1">
                        {pokemon.types.map((type) => (
                          <span
                            key={type}
                            className="text-xs text-white px-2 py-0.5 rounded uppercase font-medium"
                            style={{ backgroundColor: TYPE_COLORS[type] }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "Lore" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Legendary Pokémon", desc: "The most powerful Pokémon in existence" },
                    { title: "Mythical Pokémon", desc: "Rare event-only Pokémon" },
                    { title: "Ultra Beasts", desc: "Mysterious beings from Ultra Space" },
                    { title: "Paradox Pokémon", desc: "Ancient and future forms" },
                  ].map((item) => (
                    <button
                      key={item.title}
                      onClick={() => handleQuickQuery(`Tell me about ${item.title}`)}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all text-left"
                    >
                      <span className="font-semibold text-gray-800 block">{item.title}</span>
                      <span className="text-sm text-gray-500">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-3 text-center text-xs text-red-200 px-4">
        Pokémon is owned by Nintendo, Game Freak, and The Pokémon Company. This agent is for educational and strategy exploration only. Powered by{" "}
        <a href="https://ringel.ai/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
          Ringel.AI
        </a>
      </footer>
    </div>
  );
}
