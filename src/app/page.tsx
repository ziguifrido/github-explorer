'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LayoutHeader } from '@/components/LayoutHeader';
import { ViewSearch } from '@/components/ViewSearch';
import { ViewUser } from '@/components/ViewUser';
import { ViewRepo } from '@/components/ViewRepo';
import { UserDashboardSkeleton, RepoDashboardSkeleton } from '@/components/DashboardSkeletons';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { view, loading, loadingType } = useAppStore();

  // Determine what content to show based on loading and view state
  const renderContent = () => {
    if (loading) {
      if (loadingType === 'repo') {
        return <RepoDashboardSkeleton key="repo-skeleton" />;
      }
      return <UserDashboardSkeleton key="user-skeleton" />;
    }

    switch (view) {
      case 'user':
        return <ViewUser key="user-view" />;
      case 'repo':
        return <ViewRepo key="repo-view" />;
      case 'search':
      default:
        return <ViewSearch key="search-view" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      {/* Fixed Layout Header */}
      <LayoutHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Decorative subtle ambient lights */}
        <div className="absolute top-[-10%] left-[20%] w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none select-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none select-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={loading ? `loading-${loadingType}` : `view-${view}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="py-6 border-t border-zinc-900 text-center text-xs text-zinc-600 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GitHub Explorer &copy; {new Date().getFullYear()}</span>
          <span className="flex items-center gap-1.5">
            Built with Next.js 16, Tailwind v4 &amp; Base UI
          </span>
        </div>
      </footer>
    </div>
  );
}
