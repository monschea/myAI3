"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageWall } from "@/components/messages/message-wall";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, OWNER_NAME } from "@/config";
import { 
  Search, Zap, Shield, Swords, BookOpen, 
  Trash2, ArrowUp, Loader2
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
];

const FEATURED_POKEMON = [
  { name: "Charizard", types: ["fire", "flying"], tier: "OU" },
  { name: "Garchomp", types: ["dragon", "ground"], tier: "OU" },
  { name: "Greninja", types: ["water", "dark"], tier: "Uber" },
  { name: "Dragonite", types: ["dragon", "flying"], tier: "OU" },
  { name: "Tyranitar", types: ["rock", "dark"], tier: "OU" },
  { name: "Gengar", types: ["ghost", "poison"], tier: "OU" },
];

export default function ChatPage() {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
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
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-500 to-orange-500 flex flex-col">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-red-700 to-red-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-4 border-red-800">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-gray-800" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{AI_NAME}</h1>
              <p className="text-xs text-red-200">Type matchups, strategies & team building</p>
            </div>
          </div>
          {hasMessages && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-white hover:bg-white/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col p-4">
        <div className="flex-1 bg-white/95 backdrop-blur shadow-xl rounded-2xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {!hasMessages ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">P</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome, Trainer!</h2>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span><strong>Type matchups</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Swords className="w-4 h-4 text-red-500" />
                          <span><strong>Battle strategies</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span><strong>Team building</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <BookOpen className="w-4 h-4 text-green-500" />
                          <span><strong>Pokédex info</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Quick Questions</h3>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUERIES.map((query) => (
                      <button
                        key={query}
                        onClick={() => handleQuickQuery(query)}
                        className="px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">All Types</h3>
                  <div className="grid grid-cols-6 gap-2">
                    {TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeClick(type)}
                        className="flex flex-col items-center p-2 rounded-lg hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${TYPE_COLORS[type]}15` }}
                      >
                        <div
                          className="w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white text-[10px] font-bold uppercase"
                          style={{ backgroundColor: TYPE_COLORS[type] }}
                        >
                          {type.slice(0, 3)}
                        </div>
                        <span className="text-[10px] text-gray-600 capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Featured Pokémon</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FEATURED_POKEMON.map((pokemon) => (
                      <button
                        key={pokemon.name}
                        onClick={() => handlePokemonClick(pokemon.name)}
                        className="bg-white rounded-lg p-3 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{pokemon.name}</span>
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            {pokemon.tier}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {pokemon.types.map((type) => (
                            <span
                              key={type}
                              className="text-[10px] text-white px-1.5 py-0.5 rounded uppercase font-medium"
                              style={{ backgroundColor: TYPE_COLORS[type] }}
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <MessageWall messages={messages} />
                <div ref={messagesEndRef} />
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
                  placeholder="Ask about Pokémon types, strategies, matchups..."
                  className="pl-10 pr-4 py-3 bg-gray-50 border-gray-200 focus:border-red-400 focus:ring-red-400 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-xs text-red-200">
        © {new Date().getFullYear()} {OWNER_NAME} • Powered by AI
      </footer>
    </div>
  );
}
