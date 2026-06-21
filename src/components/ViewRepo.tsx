'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import { 
  Star, 
  GitFork, 
  Eye, 
  AlertCircle, 
  Calendar, 
  FileText, 
  ExternalLink,
  GitCommit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
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

export const ViewRepo = () => {
  const { 
    activeRepo, 
    activeRepoReadme, 
    activeRepoCommits, 
    activeRepoContributors, 
    activeRepoLanguages, 
    selectUser 
  } = useAppStore();

  // 1. Languages breakdown
  const languageData = useMemo(() => {
    const totalBytes = Object.values(activeRepoLanguages).reduce((a, b) => a + b, 0);
    if (totalBytes === 0) return [];
    
    return Object.entries(activeRepoLanguages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100
      }))
      .sort((a, b) => b.bytes - a.bytes);
  }, [activeRepoLanguages]);

  if (!activeRepo) return null;

  // Date Format Helpers
  const createdDate = new Date(activeRepo.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const pushedDate = new Date(activeRepo.pushed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8"
    >
      {/* 1. Main Info Header */}
      <Card className="glass-card border-border overflow-hidden">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  onClick={() => selectUser(activeRepo.owner.login)}
                  className="text-sm font-semibold font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {activeRepo.owner.login}
                </span>
                <span className="text-tertiary">/</span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-mono">
                  {activeRepo.name}
                </h2>
                {activeRepo.fork && (
                  <Badge variant="outline" className="border-border text-[10px] text-tertiary py-0.5 px-1.5 rounded-md">
                    Forked
                  </Badge>
                )}
              </div>
              <p className="text-[11px] md:text-xs text-tertiary font-mono flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created on {createdDate}
                </span>
                <span className="flex items-center gap-1">
                  <GitCommit className="w-3.5 h-3.5" />
                  Last push on {pushedDate}
                </span>
              </p>
            </div>
            
            <a
              href={activeRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground border border-border hover:border-ring bg-secondary hover:bg-muted/50 py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all w-fit cursor-pointer h-10"
            >
              Open on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {activeRepo.description && (
            <p className="text-sm md:text-base text-foreground max-w-4xl leading-relaxed">
              {activeRepo.description}
            </p>
          )}

          {/* Topics/Tags & License */}
          <div className="flex flex-wrap items-center gap-3">
            {activeRepo.license && (
              <Badge variant="outline" className="border-border bg-card/80 text-muted-foreground text-[11px] py-1 px-2.5 rounded-lg flex gap-1 items-center shrink-0">
                <FileText className="w-3.5 h-3.5 text-tertiary" />
                {activeRepo.license.spdx_id || activeRepo.license.name}
              </Badge>
            )}

            <div className="flex flex-wrap gap-1.5">
              {activeRepo.topics.map(topic => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className="bg-muted hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] py-0.5 px-2 rounded-md font-sans border border-subtle"
                >
                  #{topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Advanced Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-tertiary font-medium uppercase tracking-wider block">Stars</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                {activeRepo.stargazers_count.toLocaleString()}
              </span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-tertiary font-medium uppercase tracking-wider block">Forks</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                {activeRepo.forks_count.toLocaleString()}
              </span>
              <GitFork className="w-4 h-4 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-tertiary font-medium uppercase tracking-wider block">Open Issues</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                {activeRepo.open_issues_count.toLocaleString()}
              </span>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border">
          <CardContent className="p-5 space-y-1.5">
            <span className="text-xs text-tertiary font-medium uppercase tracking-wider block">Watchers</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-foreground">
                {activeRepo.watchers_count.toLocaleString()}
              </span>
              <Eye className="w-4 h-4 text-sky-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Details Navigation Tabs */}
      <Tabs defaultValue="readme" className="space-y-6">
        <TabsList className="bg-background/80 border border-border p-1 rounded-xl flex gap-1 h-fit w-fit flex-wrap">
          <TabsTrigger value="readme" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer transition-all data-[state=active]:bg-muted data-[state=active]:text-white">
            README.md
          </TabsTrigger>
          <TabsTrigger value="commits" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer transition-all data-[state=active]:bg-muted data-[state=active]:text-white">
            Recent Commits
          </TabsTrigger>
          <TabsTrigger value="contributors" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer transition-all data-[state=active]:bg-muted data-[state=active]:text-white">
            Contributors
          </TabsTrigger>
          <TabsTrigger value="languages" className="rounded-lg text-xs font-semibold px-4 py-2 cursor-pointer transition-all data-[state=active]:bg-muted data-[state=active]:text-white">
            Languages
          </TabsTrigger>
        </TabsList>

        {/* README Tab content */}
        <TabsContent value="readme">
          <Card className="glass-card border-border">
            <CardContent className="p-6 md:p-8 max-h-[700px] overflow-y-auto">
              <div className="prose dark:prose-invert max-w-none text-foreground text-sm leading-relaxed prose-headings:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-code:font-mono prose-pre:bg-background prose-pre:border prose-pre:border-border prose-a:text-foreground hover:prose-a:text-white">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    img: ({ src, alt }) => {
                      if (!src || typeof src !== 'string') return null;
                      const isAbsolute = src.startsWith('http://') || src.startsWith('https://');
                      const resolved = isAbsolute
                        ? src
                        : `https://raw.githubusercontent.com/${activeRepo.owner.login}/${activeRepo.name}/${activeRepo.default_branch}/${src.replace(/^\.?\//, '')}`;
                      // eslint-disable-next-line @next/next/no-img-element
                      return <img src={resolved} alt={alt || ''} className="max-w-full h-auto rounded-lg" />;
                    },
                  }}
                >
                  {activeRepoReadme || 'No README available for this repository.'}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commits timeline */}
        <TabsContent value="commits">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-wide text-foreground">Latest 10 Commits</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {activeRepoCommits.length > 0 ? (
                  <div className="relative pl-6 border-l border-border space-y-6">
                  {activeRepoCommits.map((item) => {
                    const commitDate = new Date(item.commit.author.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <div key={item.sha} className="relative group">
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full border-2 border-border bg-[#09090b] group-hover:border-ring transition-colors" />
                        
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-foreground leading-snug">
                            {item.commit.message}
                          </p>
                          <div className="flex items-center gap-2">
                            {item.author && (
                              <Image 
                                src={item.author.avatar_url} 
                                alt={item.commit.author.name}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full object-cover border border-border shrink-0"
                              />
                            )}
                            <span 
                              onClick={() => item.author && selectUser(item.author.login)}
                              className={`text-xs text-muted-foreground font-mono ${item.author ? 'hover:text-foreground hover:underline cursor-pointer' : ''}`}
                            >
                              {item.author ? item.author.login : item.commit.author.name}
                            </span>
                            <span className="text-[10px] text-tertiary font-mono">|</span>
                            <span className="text-[10px] text-tertiary font-mono">
                              {commitDate}
                            </span>
                            <span className="text-[10px] font-mono text-tertiary truncate ml-auto max-w-[80px] sm:max-w-none">
                              {item.sha.slice(0, 7)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-tertiary text-sm py-6 text-center">No commits found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contributors tab */}
        <TabsContent value="contributors">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-wide text-foreground">Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {activeRepoContributors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {activeRepoContributors.map((c) => (
                    <div 
                      key={c.id}
                      onClick={() => selectUser(c.login)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary hover:bg-muted/40 hover:border-border transition-all duration-200 cursor-pointer group"
                    >
                      <Image 
                        src={c.avatar_url} 
                        alt={c.login}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-foreground truncate font-mono">
                          {c.login}
                        </h4>
                        <span className="text-[10px] text-tertiary block mt-0.5">
                          {c.contributions} {c.contributions === 1 ? 'commit' : 'commits'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-tertiary text-sm py-6 text-center">No contributors found.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages tab */}
        <TabsContent value="languages">
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold tracking-wide text-foreground">Language Composition</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              {languageData.length > 0 ? (
                <div className="space-y-6">
                  {/* Horizontally Stacked Percent Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-muted border border-subtle select-none">
                    {languageData.map((item) => (
                      <div
                        key={item.name}
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: LANGUAGE_COLORS[item.name] || DEFAULT_COLOR
                        }}
                        className="h-full shrink-0 first:rounded-l-full last:rounded-r-full hover:brightness-110 transition-all"
                        title={`${item.name}: ${item.percentage.toFixed(1)}%`}
                      />
                    ))}
                  </div>

                  {/* Detail items list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {languageData.map((item) => {
                      const color = LANGUAGE_COLORS[item.name] || DEFAULT_COLOR;
                      return (
                        <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/80">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-xs font-semibold text-foreground">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-medium text-foreground">
                              {item.percentage.toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-tertiary font-mono block mt-0.5">
                              {(item.bytes / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-tertiary text-sm py-6 text-center">No languages detected.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};
