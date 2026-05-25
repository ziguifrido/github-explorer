'use client';

import { useTheme } from '@/lib/theme';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-100 transition-colors" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-100 transition-colors" />
        )}
      </motion.div>
    </button>
  );
}
