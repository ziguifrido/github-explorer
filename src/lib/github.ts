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

const getHeaders = (): HeadersInit => {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch function with error handling
async function githubFetch<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `https://api.github.com${endpoint}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // caching in nextjs if server side
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not Found');
    }
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        throw new Error('GitHub API rate limit exceeded. Please add a NEXT_PUBLIC_GITHUB_TOKEN.');
      }
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
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
};
