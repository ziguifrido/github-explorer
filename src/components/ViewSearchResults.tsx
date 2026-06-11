'use client';

import React from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import {
  Star,
  GitFork,
  Users,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

const DEFAULT_COLOR = '#8b5cf6';
const AVATAR_FALLBACK_SRC = '/avatar-placeholder.svg';
const USERS_PER_PAGE = 10;
const REPOS_PER_PAGE = 10;

function SearchUserCard({
  user,
  selectUser,
}: {
  user: ReturnType<typeof useAppStore.getState>['searchUsersResults'][number];
  selectUser: (username: string) => Promise<void>;
}) {
  const [avatarSrc, setAvatarSrc] = React.useState(user.avatar_url);

  return (
    <button
      type="button"
      onClick={() => selectUser(user.login)}
      aria-label={`Select ${user.login}`}
      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-accent/40 hover:border-border transition-all duration-200 cursor-pointer group"
    >
      <Image
        src={avatarSrc}
        alt={user.login}
        width={56}
        height={56}
        onError={() => {
          if (avatarSrc !== AVATAR_FALLBACK_SRC) {
            setAvatarSrc(AVATAR_FALLBACK_SRC);
          }
        }}
        className="w-14 h-14 rounded-full border-2 border-border object-cover group-hover:border-ring transition-colors"
      />
      <span className="text-xs font-mono text-foreground text-center truncate w-full">
        {user.login}
      </span>
    </button>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  label,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-2 select-none">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label={`Previous ${label} page`}
        className="border-border bg-card/80 text-muted-foreground hover:text-foreground h-8 w-8 p-0 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs text-tertiary font-medium font-mono">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label={`Next ${label} page`}
        className="border-border bg-card/80 text-muted-foreground hover:text-foreground h-8 w-8 p-0 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

function SearchResultsContent({
  searchUsersResults,
  searchReposResults,
  searchQuery,
  selectUser,
  selectRepo,
}: Pick<
  ReturnType<typeof useAppStore.getState>,
  | 'searchUsersResults'
  | 'searchReposResults'
  | 'searchQuery'
  | 'selectUser'
  | 'selectRepo'
>) {
  const [usersPage, setUsersPage] = React.useState(1);
  const [reposPage, setReposPage] = React.useState(1);

  const hasUsers = searchUsersResults.length > 0;
  const hasRepos = searchReposResults.length > 0;
  const usersTotalPages = Math.max(1, Math.ceil(searchUsersResults.length / USERS_PER_PAGE));
  const reposTotalPages = Math.max(1, Math.ceil(searchReposResults.length / REPOS_PER_PAGE));
  const safeUsersPage = Math.min(usersPage, usersTotalPages);
  const safeReposPage = Math.min(reposPage, reposTotalPages);
  const visibleUsers = searchUsersResults.slice(
    (safeUsersPage - 1) * USERS_PER_PAGE,
    safeUsersPage * USERS_PER_PAGE
  );
  const visibleRepos = searchReposResults.slice(
    (safeReposPage - 1) * REPOS_PER_PAGE,
    safeReposPage * REPOS_PER_PAGE
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
            <Search className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Search Results
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {!hasUsers && !hasRepos ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-tertiary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No results found
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            No users or repositories matched &ldquo;{searchQuery}&rdquo;. Try a different search term.
          </p>
        </div>
      ) : (
        <>
          {/* Users Section */}
          {hasUsers && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-subtle pb-2">
                <Users className="w-4 h-4 text-tertiary" />
                <h2 className="text-sm font-semibold text-foreground tracking-wide">
                  Users
                </h2>
                <Badge variant="secondary" className="bg-muted text-foreground font-mono rounded-md py-0 px-1.5 text-xs">
                  {searchUsersResults.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {visibleUsers.map((user) => (
                  <SearchUserCard
                    key={user.id}
                    user={user}
                    selectUser={selectUser}
                  />
                ))}
              </div>
              <PaginationControls
                currentPage={safeUsersPage}
                totalPages={usersTotalPages}
                onPageChange={setUsersPage}
                label="users"
              />
            </section>
          )}

          {/* Repositories Section */}
          {hasRepos && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-subtle pb-2">
                <BookOpen className="w-4 h-4 text-tertiary" />
                <h2 className="text-sm font-semibold text-foreground tracking-wide">
                  Repositories
                </h2>
                <Badge variant="secondary" className="bg-muted text-foreground font-mono rounded-md py-0 px-1.5 text-xs">
                  {searchReposResults.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleRepos.map((repo) => (
                  <Card
                    key={repo.id}
                    onClick={() => selectRepo(repo.owner.login, repo.name)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectRepo(repo.owner.login, repo.name);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${repo.owner.login}/${repo.name}`}
                    className="border-border cursor-pointer flex flex-col justify-between group"
                  >
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {repo.owner.login} /
                          </span>
                          <h4 className="text-sm font-bold tracking-tight text-foreground truncate group-hover:text-foreground transition-colors font-mono">
                            {repo.name}
                          </h4>
                        </div>
                        {repo.fork && (
                          <Badge variant="secondary" className="border border-border bg-muted text-[10px] text-tertiary py-0.5 px-1.5 rounded-md shrink-0">
                            Fork
                          </Badge>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-tertiary font-mono"
                            >
                              {topic}
                            </span>
                          ))}
                          {repo.topics.length > 3 && (
                            <span className="text-[10px] text-tertiary">
                              +{repo.topics.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-3 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex items-center gap-1.5 min-w-0 text-xs text-muted-foreground">
                        {repo.language ? (
                          <>
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-border"
                              style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || DEFAULT_COLOR }}
                            />
                            <span className="truncate">{repo.language}</span>
                          </>
                        ) : (
                          <span className="text-tertiary">No language</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono shrink-0">
                        <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <Star className="w-3.5 h-3.5 text-amber-500/70" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 hover:text-foreground transition-colors">
                          <GitFork className="w-3.5 h-3.5 text-muted-foreground" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <PaginationControls
                currentPage={safeReposPage}
                totalPages={reposTotalPages}
                onPageChange={setReposPage}
                label="repositories"
              />
            </section>
          )}
        </>
      )}
    </motion.div>
  );
}

export const ViewSearchResults = () => {
  const {
    searchUsersResults,
    searchReposResults,
    searchQuery,
    selectUser,
    selectRepo,
  } = useAppStore();

  return (
    <SearchResultsContent
      key={searchQuery}
      searchUsersResults={searchUsersResults}
      searchReposResults={searchReposResults}
      searchQuery={searchQuery}
      selectUser={selectUser}
      selectRepo={selectRepo}
    />
  );
};
