'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  History, 
  Send, 
  AlertCircle, 
  CornerDownLeft,
  Compass
} from 'lucide-react';
import { ExplorerIcon } from '@/components/ui/custom-icon';
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
    { label: 'Machine Learning', value: 'machine learning' },
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
        
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-3">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-muted border border-border flex items-center justify-center">
            <ExplorerIcon className="w-5 h-5 md:w-7 md:h-7 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-primary to-tertiary bg-clip-text text-transparent">
            GitHub Explorer
          </h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Explore the GitHub Ecosystem
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
          <div className="w-full rounded-2xl border border-border bg-card backdrop-blur-xl p-3 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 transition-all duration-300">
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
              placeholder="Search users, repositories, or type 'user/repo'..."
              className="w-full bg-transparent resize-none outline-none border-none py-2 px-3 text-sm md:text-base text-foreground placeholder-tertiary min-h-[44px] max-h-[180px] scrollbar-none font-sans"
            />
            
            <div className="flex items-center justify-between pt-2 border-t border-subtle/60 mt-1 px-1">
              <span className="text-[10px] md:text-xs text-tertiary flex items-center gap-1 select-none">
                <CornerDownLeft className="w-3 h-3" />
                <span>Press Enter to search</span>
              </span>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="w-8 h-8 rounded-lg bg-primary text-primary-foreground hover:bg-white disabled:bg-muted disabled:text-tertiary transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
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
            className="text-xs px-3 py-1.5 rounded-full border border-subtle bg-secondary text-tertiary hover:text-foreground hover:border-border hover:bg-accent/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
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
            <Card className="border-destructive bg-destructive/10 backdrop-blur-sm p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/30 border border-destructive/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex-1 space-y-1.5 pt-0.5">
                <h4 className="text-xs font-semibold text-destructive tracking-wide uppercase">
                  System Response
                </h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {error}
                </p>
                <div className="pt-1">
                  <Button 
                    variant="link" 
                    onClick={resetError}
                    className="p-0 h-auto text-xs text-destructive hover:text-destructive transition-colors cursor-pointer"
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
            <div className="flex items-center justify-between border-b border-subtle pb-2">
              <span className="text-xs font-medium text-tertiary flex items-center gap-1.5 select-none">
                <History className="w-3.5 h-3.5" />
                Recent Searches
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
                className="text-[10px] text-tertiary hover:text-foreground hover:bg-accent h-6 px-2 cursor-pointer"
              >
                Clear History
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {searchHistory.map((item) => (
                <div
                  key={`${item.query}-${item.timestamp}`}
                  onClick={() => handleHistoryClick(item.query)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-subtle bg-secondary hover:bg-accent/40 hover:border-border transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-muted/60 border border-border flex items-center justify-center shrink-0">
                      {item.type === 'repo' ? (
                        <Compass className="w-3.5 h-3.5 text-tertiary group-hover:text-foreground transition-colors" />
                      ) : item.type === 'search' ? (
                        <History className="w-3.5 h-3.5 text-tertiary group-hover:text-foreground transition-colors" />
                      ) : (
                        <GithubIcon className="w-3.5 h-3.5 text-tertiary group-hover:text-foreground transition-colors" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground font-mono truncate transition-colors">
                      {item.query}
                    </span>
                  </div>
                  <span className="text-[10px] text-tertiary group-hover:text-tertiary font-sans transition-colors whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString('en-US', {
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
