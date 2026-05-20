'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { 
  Star, 
  GitFork, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TwitterIcon } from '@/components/ui/icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

// Common GitHub language colors mapping
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

const DEFAULT_COLOR = '#8b5cf6'; // violet-500

export const ViewUser = () => {
  const { activeUser, activeUserRepos, selectRepo, loading } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'updated'>('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!activeUser) return null;

  // 1. Calculate cumulative metrics
  const totalStars = useMemo(() => {
    return activeUserRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  }, [activeUserRepos]);

  const totalForks = useMemo(() => {
    return activeUserRepos.reduce((acc, repo) => acc + repo.forks_count, 0);
  }, [activeUserRepos]);

  // 2. Prepare Donut Chart Data
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    activeUserRepos.forEach(repo => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    const sortedData = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Group items beyond top 5 into "Others"
    if (sortedData.length > 5) {
      const top5 = sortedData.slice(0, 5);
      const othersCount = sortedData.slice(5).reduce((acc, curr) => acc + curr.value, 0);
      top5.push({ name: 'Others', value: othersCount });
      return top5;
    }

    return sortedData;
  }, [activeUserRepos]);

  // 3. Find all unique languages for filter dropdown
  const uniqueLanguages = useMemo(() => {
    const langs = new Set<string>();
    activeUserRepos.forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return ['All', ...Array.from(langs)];
  }, [activeUserRepos]);

  // 4. Filter & Sort Repositories
  const filteredAndSortedRepos = useMemo(() => {
    let result = activeUserRepos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLang = selectedLang === 'All' || repo.language === selectedLang;
      return matchesSearch && matchesLang;
    });

    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'forks') return b.forks_count - a.forks_count;
      // Default / updated
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [activeUserRepos, searchTerm, selectedLang, sortBy]);

  // 5. Pagination
  const totalPages = Math.ceil(filteredAndSortedRepos.length / itemsPerPage);
  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRepos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRepos, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLang, sortBy]);

  const formattedDate = new Date(activeUser.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8"
    >
      {/* 1. Header Profile Panel */}
      <Card className="glass-card border-zinc-800/80 bg-zinc-950/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
          <a
            href={activeUser.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1 text-xs font-medium"
          >
            View on GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 pt-8">
          <img
            src={activeUser.avatar_url}
            alt={activeUser.name || activeUser.login}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-zinc-800 shadow-xl shrink-0 object-cover"
          />
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
                {activeUser.name || activeUser.login}
              </h2>
              <p className="text-sm font-mono text-zinc-400">@{activeUser.login}</p>
            </div>
            
            {activeUser.bio && (
              <p className="text-zinc-300 text-sm md:text-base max-w-2xl leading-relaxed">
                {activeUser.bio}
              </p>
            )}

            {/* Info Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-xs text-zinc-400">
              {activeUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {activeUser.location}
                </span>
              )}
              {activeUser.blog && (
                <a
                  href={activeUser.blog.startsWith('http') ? activeUser.blog : `https://${activeUser.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                  {activeUser.blog.replace(/(^\w+:|^)\/\//, '')}
                </a>
              )}
              {activeUser.twitter_username && (
                <a
                  href={`https://twitter.com/${activeUser.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
                >
                  <TwitterIcon className="w-3.5 h-3.5 text-zinc-500" />
                  {activeUser.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Joined on {formattedDate}
              </span>
            </div>

            {/* Quick counters */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <Badge variant="outline" className="border-zinc-800 bg-zinc-950/30 text-zinc-300 py-1.5 px-3 rounded-lg flex gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <strong>{activeUser.followers.toLocaleString()}</strong> followers
              </Badge>
              <Badge variant="outline" className="border-zinc-800 bg-zinc-950/30 text-zinc-300 py-1.5 px-3 rounded-lg flex gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <strong>{activeUser.following.toLocaleString()}</strong> following
              </Badge>
              <Badge variant="outline" className="border-zinc-800 bg-zinc-950/30 text-zinc-300 py-1.5 px-3 rounded-lg flex gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                <strong>{activeUser.public_repos.toLocaleString()}</strong> repositories
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Mini Stats Cards & Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-zinc-800/80 bg-zinc-950/20">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">Total Stars</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-zinc-100">{totalStars.toLocaleString()}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-zinc-800/80 bg-zinc-950/20">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">Total Forks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-zinc-100">{totalForks.toLocaleString()}</span>
              <GitFork className="w-4 h-4 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-zinc-800/80 bg-zinc-950/20">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">Avg Stars/Repo</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-zinc-100">
                {activeUserRepos.length > 0 ? (totalStars / activeUserRepos.length).toFixed(1) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-zinc-800/80 bg-zinc-950/20">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider block">Originals vs Forks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg md:text-xl font-bold font-mono tracking-tight text-zinc-100">
                {activeUserRepos.filter(r => !r.fork).length} / {activeUserRepos.filter(r => r.fork).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Dashboard Section (Left Donut, Right Repositories) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Languages Donut Chart */}
        <Card className="glass-card border-zinc-800/80 bg-zinc-950/20 h-fit lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold tracking-wide text-zinc-300">Most Used Languages</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Distribution by repository count</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4">
            {mounted && chartData.length > 0 ? (
              <div className="w-full h-[280px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={LANGUAGE_COLORS[entry.name] || DEFAULT_COLOR}
                          stroke="#09090b"
                          strokeWidth={2}
                          className="focus:outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const color = LANGUAGE_COLORS[data.name] || DEFAULT_COLOR;
                          return (
                            <div className="border border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-3 py-2 rounded-lg text-xs shadow-xl space-y-1">
                              <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                {data.name}
                              </span>
                              <span className="text-zinc-400 font-mono block">
                                {data.value} {data.value === 1 ? 'repository' : 'repositories'} (
                                {((data.value / activeUserRepos.length) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Render custom legend for better design */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2 max-w-xs text-[11px] text-zinc-400">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: LANGUAGE_COLORS[item.name] || DEFAULT_COLOR }}
                      />
                      <span>{item.name}</span>
                      <span className="font-mono text-zinc-600">({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-zinc-500 text-sm">
                No language data.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Repositories List/Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              Public Repositories
              <Badge variant="secondary" className="bg-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono rounded-md py-0 px-1.5 text-xs">
                {filteredAndSortedRepos.length}
              </Badge>
            </h3>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search bar inside list */}
              <div className="relative w-full sm:w-[200px] group">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                <Input
                  placeholder="Search repos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 border-zinc-800 bg-zinc-950/30 text-xs rounded-lg focus-visible:ring-zinc-700/50"
                />
              </div>

              {/* Language filter dropdown */}
              <div className="relative">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="appearance-none h-9 border border-zinc-800 bg-zinc-950/40 text-xs rounded-lg px-3 pr-8 text-zinc-300 outline-none hover:border-zinc-700 focus:border-zinc-600 transition-all cursor-pointer font-sans"
                >
                  {uniqueLanguages.map((lang) => (
                    <option key={lang} value={lang} className="bg-zinc-950 text-zinc-300">
                      {lang === 'All' ? 'Languages' : lang}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2.5 top-3 w-3 h-3 text-zinc-500 pointer-events-none" />
              </div>

              {/* Sorting options dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none h-9 border border-zinc-800 bg-zinc-950/40 text-xs rounded-lg px-3 pr-8 text-zinc-300 outline-none hover:border-zinc-700 focus:border-zinc-600 transition-all cursor-pointer font-sans"
                >
                  <option value="updated" className="bg-zinc-950 text-zinc-300">Updated</option>
                  <option value="stars" className="bg-zinc-950 text-zinc-300">Popularity</option>
                  <option value="forks" className="bg-zinc-950 text-zinc-300">Forks</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-3 w-3 h-3 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Repos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedRepos.length > 0 ? (
              paginatedRepos.map((repo) => (
                <Card
                  key={repo.id}
                  onClick={() => selectRepo(repo.owner.login, repo.name)}
                  className="glass-card border-zinc-800/80 bg-zinc-950/20 cursor-pointer flex flex-col justify-between"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold tracking-tight text-zinc-200 truncate hover:text-zinc-100 hover:underline transition-colors font-mono">
                        {repo.name}
                      </h4>
                      {repo.fork && (
                        <Badge variant="secondary" className="border border-zinc-800 bg-zinc-900/50 text-[10px] text-zinc-500 py-0.5 px-1.5 rounded-md">
                          Fork
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed h-8">
                        {repo.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex items-center justify-between border-t border-zinc-900/40 mt-auto">
                    {/* Language dot */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      {repo.language ? (
                        <>
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || DEFAULT_COLOR }}
                          />
                          <span>{repo.language}</span>
                        </>
                      ) : (
                        <span>No language</span>
                      )}
                    </div>

                    {/* Stats counters */}
                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-zinc-500 fill-zinc-500/10" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-zinc-500 text-sm">
                No repositories match your search criteria.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 select-none">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-200 h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-zinc-500 font-medium font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-200 h-8 w-8 p-0 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
