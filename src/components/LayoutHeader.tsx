"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { ExplorerIcon } from "@/components/ui/custom-icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export const LayoutHeader = () => {
  const { view, navigationStack, popNavigation, search } = useAppStore();

  const goToProjectRepo = () => {
    search("ziguifrido/github-explorer");
  };

  const resetToSearch = () => {
    useAppStore.setState({
      navigationStack: [{ view: "search" }],
      view: "search",
      username: "",
      repoOwner: "",
      repoName: "",
      error: null,
    });
  };

  // Check if we came from a User dashboard to the Repository dashboard
  const hasUserInStack = React.useMemo(() => {
    if (view !== "repo") return false;
    // Look backward in the stack to find if there is a 'user' view before the current 'repo' view
    return navigationStack.some((step) => step.view === "user");
  }, [view, navigationStack]);

  const showHeaderNav = view !== "search";

  return (
    <header className="sticky top-0 z-50 w-full glass-header backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <div
          onClick={goToProjectRepo}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center group-hover:border-border transition-colors">
            <ExplorerIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-200 transition-colors hidden sm:block">
            GitHub Explorer
          </span>
        </div>

        {/* Dynamic Navigation Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AnimatePresence mode="wait">
            {showHeaderNav && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {/* Back to User button (secondary, displayed on screen C if navigated from screen B) */}
                {hasUserInStack && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={popNavigation}
                    className="border-border bg-secondary hover:bg-accent text-foreground hover:text-foreground text-xs gap-1.5 cursor-pointer h-9 px-3"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Back to User</span>
                    <span className="md:hidden">User</span>
                  </Button>
                )}

                {/* Always visible prominent back to Search button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={resetToSearch}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground text-xs gap-1.5 cursor-pointer font-medium h-9 px-3 shadow-[0_4px_12px_rgba(255,255,255,0.05)]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
