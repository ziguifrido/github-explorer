export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
  topics: string[];
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface GitHubReadme {
  content: string;
  encoding: string;
  download_url: string;
}

export interface GitHubSearchUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  score: number;
}

export type GitHubSearchUsersResponse = GitHubSearchResponse<GitHubSearchUser>;
export type GitHubSearchReposResponse = GitHubSearchResponse<GitHubRepository>;

export interface GitHubSearchResponse<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
  page: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

const GITHUB_SEARCH_PAGE_SIZE = 100;
const GITHUB_SEARCH_RESULT_LIMIT = 1000;

// Generic fetch function with error handling.
// GitHub API access is proxied through a same-origin Route Handler so any
// server-only token stays off the client bundle.
async function githubFetch<T>(endpoint: string): Promise<T> {
  if (!endpoint.startsWith('/')) {
    throw new Error('Invalid GitHub API endpoint.');
  }

  const response = await fetch(`/api/github${endpoint}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not Found');
    }
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

async function searchFirstPage<T>(
  endpoint: string,
  queryParams: URLSearchParams
): Promise<GitHubSearchResponse<T>> {
  queryParams.set('per_page', String(GITHUB_SEARCH_PAGE_SIZE));
  queryParams.set('page', '1');

  const data = await githubFetch<{
    total_count: number;
    incomplete_results: boolean;
    items: T[];
  }>(`${endpoint}?${queryParams.toString()}`);

  const totalPages = Math.ceil(Math.min(data.total_count, GITHUB_SEARCH_RESULT_LIMIT) / GITHUB_SEARCH_PAGE_SIZE);

  return {
    ...data,
    page: 1,
    total_pages: totalPages,
    next_page: totalPages > 1 ? 2 : null,
    prev_page: null,
  };
}

function buildSearchParams(
  query: string,
  page: number,
  extraParams?: URLSearchParams
): URLSearchParams {
  const params = new URLSearchParams(extraParams);
  params.set('q', query);
  params.set('per_page', String(GITHUB_SEARCH_PAGE_SIZE));
  params.set('page', String(page));
  return params;
}

async function fetchSearchPage<T>(
  endpoint: string,
  query: string,
  page: number,
  extraParams?: URLSearchParams
): Promise<GitHubSearchResponse<T>> {
  const params = buildSearchParams(query, page, extraParams);
  const data = await githubFetch<{
    total_count: number;
    incomplete_results: boolean;
    items: T[];
  }>(`${endpoint}?${params.toString()}`);

  const totalPages = Math.ceil(Math.min(data.total_count, GITHUB_SEARCH_RESULT_LIMIT) / GITHUB_SEARCH_PAGE_SIZE);

  return {
    ...data,
    page,
    total_pages: totalPages,
    next_page: page < totalPages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
  };
}

export const githubApi = {
  getUser: async (username: string): Promise<GitHubUser> => {
    return githubFetch<GitHubUser>(`/users/${username}`);
  },

  getUserRepos: async (username: string): Promise<GitHubRepository[]> => {
    return githubFetch<GitHubRepository[]>(`/users/${username}/repos?sort=updated&per_page=100`);
  },

  getRepo: async (owner: string, repo: string): Promise<GitHubRepository> => {
    return githubFetch<GitHubRepository>(`/repos/${owner}/${repo}`);
  },

  getRepoReadme: async (owner: string, repo: string): Promise<GitHubReadme> => {
    return githubFetch<GitHubReadme>(`/repos/${owner}/${repo}/readme`);
  },

  getRepoCommits: async (owner: string, repo: string): Promise<GitHubCommit[]> => {
    return githubFetch<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=10`);
  },

  getRepoContributors: async (owner: string, repo: string): Promise<GitHubContributor[]> => {
    return githubFetch<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=20`);
  },

  getRepoLanguages: async (owner: string, repo: string): Promise<Record<string, number>> => {
    return githubFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
  },

  searchUsers: async (query: string): Promise<GitHubSearchUsersResponse> => {
    return searchFirstPage<GitHubSearchUser>(
      '/search/users',
      new URLSearchParams({ q: query })
    );
  },

  searchRepositories: async (query: string): Promise<GitHubSearchReposResponse> => {
    return searchFirstPage<GitHubRepository>(
      '/search/repositories',
      new URLSearchParams({
        q: query,
        sort: 'stars',
        order: 'desc',
      })
    );
  },

  fetchSearchPage,
};
