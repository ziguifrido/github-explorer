'use client';

import { useTheme } from '@/lib/theme';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg border border-border bg-secondary hover:bg-accent hover:border-ring flex items-center justify-center transition-all cursor-pointer"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
        )}
      </motion.div>
    </button>
  );
}
