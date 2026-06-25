'use client';

import React, { useCallback, useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
}

export const ShareButton = ({ url, title }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    let shared = false;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        shared = true;
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    if (!shared) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard unavailable */
      }
    }
  }, [url, title]);

  return (
    <button
      onClick={handleShare}
      className="text-muted-foreground hover:text-foreground border border-border hover:border-ring bg-secondary hover:bg-muted/50 py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all w-fit cursor-pointer h-10"
      title="Share"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
};
