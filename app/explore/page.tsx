"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, Globe, Briefcase, Cpu, Trophy, MessageCircle, ArrowRight, Clock, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quickQueries = [
  "Latest news",
  "News in India",
  "News in technology",
  "Daily briefing",
  "Trend report",
  "Search news for AI",
];

const categories = [
  { id: "india", label: "India", icon: Globe, color: "from-orange-500 to-green-500", description: "National politics, economy & society" },
  { id: "business", label: "Business", icon: Briefcase, color: "from-blue-500 to-indigo-600", description: "Markets, finance & startups" },
  { id: "technology", label: "Technology", icon: Cpu, color: "from-purple-500 to-pink-500", description: "Tech, AI & digital trends" },
  { id: "sports", label: "Sports", icon: Trophy, color: "from-green-500 to-emerald-600", description: "Cricket, football & Olympics" },
];

const trendingTopics = [
  { topic: "Artificial Intelligence", category: "Technology" },
  { topic: "Stock Market", category: "Business" },
  { topic: "Cricket", category: "Sports" },
  { topic: "Elections", category: "India" },
  { topic: "Startups", category: "Business" },
  { topic: "Climate Change", category: "India" },
];

const featuredQueries = [
  { query: "What are the latest developments in AI?", category: "Technology" },
  { query: "How is the Indian economy performing?", category: "Business" },
  { query: "Latest cricket match results", category: "Sports" },
  { query: "What's happening in Indian politics?", category: "India" },
];

export default function NewsExplorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      localStorage.setItem('pending-query', `Search news for ${searchQuery}`);
      router.push('/');
    }
  };

  const handleQuickQuery = (query: string) => {
    localStorage.setItem('pending-query', query);
    router.push('/');
  };

  const handleCategoryClick = (categoryId: string) => {
    localStorage.setItem('pending-query', `News in ${categoryId}`);
    router.push('/');
  };

  const handleTopicClick = (topic: string) => {
    localStorage.setItem('pending-query', `Search news for ${topic}`);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NewsGPT</h1>
              <p className="text-xs text-slate-400">Your AI News Assistant</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome! I&apos;m your AI news assistant.</h2>
              <p className="text-slate-300 mb-4">Get the latest news across India, Business, Technology, and Sports with concise summaries and neutral coverage.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span><strong className="text-blue-400">Latest news</strong> - Top 5 headlines</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span><strong className="text-orange-400">By category</strong> - India, Business, Tech, Sports</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Search className="w-4 h-4 text-green-400" />
                  <span><strong className="text-green-400">Search</strong> - Find news on any topic</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span><strong className="text-purple-400">Trend report</strong> - What&apos;s trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for news on any topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-6 text-lg bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search
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
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {query}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="w-full justify-start bg-slate-800 p-1 rounded-xl mb-6 border border-slate-700">
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger 
              value="commands" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 rounded-lg"
            >
              Commands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-500 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center`}>
                      <cat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{cat.label}</h3>
                      <p className="text-sm text-slate-400">{cat.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Trending Topics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {trendingTopics.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleTopicClick(item.topic)}
                    className="group flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{item.topic}</p>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <div className="space-y-3">
              {featuredQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuery(item.query)}
                  className="group w-full flex items-center justify-between p-5 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <Search className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{item.query}</p>
                      <p className="text-xs text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commands">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Available Commands</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <code className="text-blue-400 font-mono">&quot;Latest news&quot;</code>
                  <p className="text-sm text-slate-300 mt-1">Get top 5 headlines with summaries</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <code className="text-blue-400 font-mono">&quot;News in [category]&quot;</code>
                  <p className="text-sm text-slate-300 mt-1">Get 3 recent updates for India, Business, Technology, or Sports</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <code className="text-blue-400 font-mono">&quot;Search news for [topic]&quot;</code>
                  <p className="text-sm text-slate-300 mt-1">Find 2 summarized articles on any topic</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <code className="text-blue-400 font-mono">&quot;Daily briefing&quot;</code>
                  <p className="text-sm text-slate-300 mt-1">Get a 1-minute readable summary of top stories</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg">
                  <code className="text-blue-400 font-mono">&quot;Trend report&quot;</code>
                  <p className="text-sm text-slate-300 mt-1">See 3 topics currently trending in news</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-slate-700 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} NewsGPT by Mansha Kohli. Powered by AI.
        </div>
      </footer>
    </div>
  );
}
