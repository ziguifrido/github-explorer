import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  githubApi, 
  GitHubUser, 
  GitHubRepository, 
  GitHubCommit, 
  GitHubContributor 
} from '@/lib/github';

export interface HistoryItem {
  type: 'user' | 'repo';
  query: string;
  timestamp: number;
}

export interface NavigationStep {
  view: 'search' | 'user' | 'repo';
  username?: string;
  repoOwner?: string;
  repoName?: string;
}

interface AppStore {
  // Navigation
  view: 'search' | 'user' | 'repo';
  username: string;
  repoOwner: string;
  repoName: string;
  navigationStack: NavigationStep[];
  
  // Cache / Data
  activeUser: GitHubUser | null;
  activeUserRepos: GitHubRepository[];
  activeRepo: GitHubRepository | null;
  activeRepoReadme: string | null;
  activeRepoCommits: GitHubCommit[];
  activeRepoContributors: GitHubContributor[];
  activeRepoLanguages: Record<string, number>;
  
  // UI Status
  loading: boolean;
  loadingType: 'user' | 'repo' | null;
  error: string | null;
  searchHistory: HistoryItem[];

  // Actions
  setView: (view: 'search' | 'user' | 'repo') => void;
  resetError: () => void;
  pushNavigation: (step: NavigationStep) => void;
  popNavigation: () => void;
  clearHistory: () => void;
  
  // Business logic
  search: (query: string) => Promise<void>;
  selectUser: (username: string) => Promise<void>;
  selectRepo: (owner: string, name: string) => Promise<void>;
}

// Robust UTF-8 Base64 decoder
const decodeBase64Utf8 = (str: string): string => {
  try {
    const base64Clean = str.replace(/\s/g, '');
    const binaryString = atob(base64Clean);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Base64 decode error", e);
    return "Error decoding README content.";
  }
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      view: 'search',
      username: '',
      repoOwner: '',
      repoName: '',
      navigationStack: [{ view: 'search' }],
      
      activeUser: null,
      activeUserRepos: [],
      activeRepo: null,
      activeRepoReadme: null,
      activeRepoCommits: [],
      activeRepoContributors: [],
      activeRepoLanguages: {},
      
      loading: false,
      loadingType: null,
      error: null,
      searchHistory: [],

      // Actions
      setView: (view) => set({ view }),
      resetError: () => set({ error: null }),
      
      pushNavigation: (step) => set((state) => {
        // Prevent duplicate consecutive navigation steps
        const lastStep = state.navigationStack[state.navigationStack.length - 1];
        if (
          lastStep &&
          lastStep.view === step.view &&
          lastStep.username === step.username &&
          lastStep.repoOwner === step.repoOwner &&
          lastStep.repoName === step.repoName
        ) {
          return {};
        }
        
        return {
          navigationStack: [...state.navigationStack, step],
          view: step.view,
          username: step.username || '',
          repoOwner: step.repoOwner || '',
          repoName: step.repoName || '',
        };
      }),
      
      popNavigation: () => set((state) => {
        if (state.navigationStack.length <= 1) {
          return {
            navigationStack: [{ view: 'search' }],
            view: 'search',
            username: '',
            repoOwner: '',
            repoName: '',
          };
        }
        
        const newStack = [...state.navigationStack];
        newStack.pop(); // Remove current
        const prevStep = newStack[newStack.length - 1];
        
        return {
          navigationStack: newStack,
          view: prevStep.view,
          username: prevStep.username || '',
          repoOwner: prevStep.repoOwner || '',
          repoName: prevStep.repoName || '',
        };
      }),

      clearHistory: () => set({ searchHistory: [] }),

      search: async (query: string) => {
        const cleanQuery = query.trim();
        if (!cleanQuery) return;
        
        const isRepo = cleanQuery.includes('/') && 
                       !cleanQuery.startsWith('/') && 
                       !cleanQuery.endsWith('/');
        
        set({ loading: true, loadingType: isRepo ? 'repo' : 'user', error: null });
        
        try {
          if (isRepo) {
            const [owner, name] = cleanQuery.split('/');
            // Perform repository details fetch
            const [repo, readmeObj, commits, contributors, languages] = await Promise.all([
              githubApi.getRepo(owner, name),
              githubApi.getRepoReadme(owner, name).catch(() => null),
              githubApi.getRepoCommits(owner, name).catch(() => []),
              githubApi.getRepoContributors(owner, name).catch(() => []),
              githubApi.getRepoLanguages(owner, name).catch(() => ({})),
            ]);

            const decodedReadme = readmeObj ? decodeBase64Utf8(readmeObj.content) : "No README available for this repository.";

            // Add search item to history
            const historyItem: HistoryItem = {
              type: 'repo',
              query: cleanQuery,
              timestamp: Date.now(),
            };

            set((state) => {
              // Deduplicate history
              const filteredHistory = state.searchHistory.filter(
                (item) => !(item.type === 'repo' && item.query.toLowerCase() === cleanQuery.toLowerCase())
              );
              return {
                activeRepo: repo,
                activeRepoReadme: decodedReadme,
                activeRepoCommits: commits,
                activeRepoContributors: contributors,
                activeRepoLanguages: languages,
                searchHistory: [historyItem, ...filteredHistory].slice(0, 10), // keep top 10
              };
            });

            get().pushNavigation({
              view: 'repo',
              repoOwner: owner,
              repoName: name,
            });
          } else {
            // Perform user details fetch
            const [user, repos] = await Promise.all([
              githubApi.getUser(cleanQuery),
              githubApi.getUserRepos(cleanQuery).catch(() => []),
            ]);

            // Add search item to history
            const historyItem: HistoryItem = {
              type: 'user',
              query: cleanQuery,
              timestamp: Date.now(),
            };

            set((state) => {
              // Deduplicate history
              const filteredHistory = state.searchHistory.filter(
                (item) => !(item.type === 'user' && item.query.toLowerCase() === cleanQuery.toLowerCase())
              );
              return {
                activeUser: user,
                activeUserRepos: repos,
                searchHistory: [historyItem, ...filteredHistory].slice(0, 10),
              };
            });

            get().pushNavigation({
              view: 'user',
              username: cleanQuery,
            });
          }
        } catch (err: any) {
          console.error("Search error:", err);
          let userFriendlyMessage = "User or repository not found. Please check the spelling.";
          if (err.message && err.message.includes('rate limit')) {
            userFriendlyMessage = err.message;
          }
          set({ error: userFriendlyMessage });
        } finally {
          set({ loading: false, loadingType: null });
        }
      },

      selectUser: async (username: string) => {
        set({ loading: true, loadingType: 'user', error: null });
        try {
          const [user, repos] = await Promise.all([
            githubApi.getUser(username),
            githubApi.getUserRepos(username).catch(() => []),
          ]);
          set({
            activeUser: user,
            activeUserRepos: repos,
          });
          get().pushNavigation({
            view: 'user',
            username,
          });
        } catch (err: any) {
          console.error("Select user error:", err);
          set({ error: "Could not load user profile." });
        } finally {
          set({ loading: false, loadingType: null });
        }
      },

      selectRepo: async (owner: string, name: string) => {
        set({ loading: true, loadingType: 'repo', error: null });
        try {
          const [repo, readmeObj, commits, contributors, languages] = await Promise.all([
            githubApi.getRepo(owner, name),
            githubApi.getRepoReadme(owner, name).catch(() => null),
            githubApi.getRepoCommits(owner, name).catch(() => []),
            githubApi.getRepoContributors(owner, name).catch(() => []),
            githubApi.getRepoLanguages(owner, name).catch(() => ({})),
          ]);

          const decodedReadme = readmeObj ? decodeBase64Utf8(readmeObj.content) : "No README available for this repository.";

          set({
            activeRepo: repo,
            activeRepoReadme: decodedReadme,
            activeRepoCommits: commits,
            activeRepoContributors: contributors,
            activeRepoLanguages: languages,
          });
          get().pushNavigation({
            view: 'repo',
            repoOwner: owner,
            repoName: name,
          });
        } catch (err: any) {
          console.error("Select repo error:", err);
          set({ error: "Could not load repository details." });
        } finally {
          set({ loading: false, loadingType: null });
        }
      },
    }),
    {
      name: 'github-explorer-storage',
      partialize: (state) => ({ searchHistory: state.searchHistory }),
    }
  )
);
