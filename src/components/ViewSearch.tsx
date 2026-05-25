'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  History, 
  Send, 
  AlertCircle, 
  Sparkles, 
  CornerDownLeft,
  Compass
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

export const ViewSearch = () => {
  const { search, loading, error, searchHistory, clearHistory, resetError } = useAppStore();
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading || !query.trim()) return;
    search(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleHistoryClick = (itemQuery: string) => {
    setQuery(itemQuery);
    search(itemQuery);
  };

  // Pre-configured popular templates for users to click
  const suggestedQueries = [
    { label: 'Torvalds', value: 'torvalds' },
    { label: 'React Project', value: 'facebook/react' },
    { label: 'Next.js Project', value: 'vercel/next.js' },
    { label: 'Vite Developer', value: 'yyx990803' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center max-w-3xl w-full mx-auto px-4 py-12 md:py-24">
      {/* Title / Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center space-y-4 mb-10 w-full"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950/40 text-xs text-zinc-400 font-medium select-none">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500/80 animate-pulse" />
          <span>GitHub API Explorer v2</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
          Explore the GitHub Ecosystem
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Search profiles, languages, and full repository details in an immersive, high-performance interface.
        </p>
      </motion.div>

      {/* Main Search Prompt Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="w-full relative glow-effect rounded-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl p-3 focus-within:border-zinc-700 focus-within:ring-1 focus-within:ring-zinc-700/50 transition-all duration-300">
            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) resetError();
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Enter a username (e.g. 'torvalds') or repository (e.g. 'facebook/react')..."
              className="w-full bg-transparent resize-none outline-none border-none py-2 px-3 text-sm md:text-base text-zinc-200 placeholder-zinc-500 min-h-[44px] max-h-[180px] scrollbar-none font-sans"
            />
            
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900/60 mt-1 px-1">
              <span className="text-[10px] md:text-xs text-zinc-500 flex items-center gap-1 select-none">
                <CornerDownLeft className="w-3 h-3" />
                <span>Press Enter to search</span>
              </span>

              <Button
                type="submit"
                disabled={loading || !query.trim()}
                size="icon"
                className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-all duration-200 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Suggested Fast Searches */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full flex flex-wrap justify-center gap-2 mt-4 select-none"
      >
        {suggestedQueries.map((suggest) => (
          <button
            key={suggest.value}
            onClick={() => handleHistoryClick(suggest.value)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-zinc-900 bg-zinc-950/20 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {suggest.label}
          </button>
        ))}
      </motion.div>

      {/* AI Chat Style Error Response */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full mt-8"
          >
            <Card className="border-red-950 bg-red-950/10 backdrop-blur-sm p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-950/30 border border-red-900/40 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 space-y-1.5 pt-0.5">
                <h4 className="text-xs font-semibold text-red-300 tracking-wide uppercase">
                  System Response
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {error}
                </p>
                <div className="pt-1">
                  <Button 
                    variant="link" 
                    onClick={resetError}
                    className="p-0 h-auto text-xs text-red-400/90 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Dismiss message
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persisted Search History Section */}
      <AnimatePresence>
        {searchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-full mt-10 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5 select-none">
                <History className="w-3.5 h-3.5" />
                Recent Searches
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 h-6 px-2 cursor-pointer"
              >
                Clear History
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {searchHistory.map((item) => (
                <div
                  key={`${item.query}-${item.timestamp}`}
                  onClick={() => handleHistoryClick(item.query)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-900/40 hover:border-zinc-800 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-zinc-900/60 border border-zinc-800 flex items-center justify-center shrink-0">
                      {item.type === 'repo' ? (
                        <Compass className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                      ) : (
                        <GithubIcon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-200 font-mono truncate transition-colors">
                      {item.query}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500 font-sans transition-colors whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
