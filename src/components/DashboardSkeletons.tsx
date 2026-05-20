import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const UserDashboardSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Profile Skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-zinc-800">
        <Skeleton className="w-24 h-24 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-3 text-center md:text-left">
          <Skeleton className="h-8 w-48 mx-auto md:mx-0 bg-zinc-800" />
          <Skeleton className="h-4 w-32 mx-auto md:mx-0 bg-zinc-800" />
          <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0 bg-zinc-800" />
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <Skeleton className="h-4 w-28 bg-zinc-800" />
            <Skeleton className="h-4 w-20 bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Mini Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-8 w-16 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Left chart, Right repositories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Language Chart Skeleton */}
        <Card className="border-zinc-800 bg-zinc-950/40 lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-5 w-40 bg-zinc-800" />
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[260px]">
            <Skeleton className="w-40 h-40 rounded-full bg-zinc-800" />
          </CardContent>
        </Card>

        {/* Right Column - Repositories List Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <Skeleton className="h-6 w-32 bg-zinc-800" />
            <Skeleton className="h-9 w-40 bg-zinc-800" />
          </div>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-zinc-800 bg-zinc-950/40">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-48 bg-zinc-800" />
                  <Skeleton className="h-5 w-16 bg-zinc-800" />
                </div>
                <Skeleton className="h-4 w-full bg-zinc-800" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-12 bg-zinc-800" />
                  <Skeleton className="h-4 w-12 bg-zinc-800" />
                  <Skeleton className="h-4 w-12 bg-zinc-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RepoDashboardSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header Repo Info Skeleton */}
      <div className="space-y-4 pb-6 border-b border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-zinc-800" />
            <Skeleton className="h-4 w-40 bg-zinc-800" />
          </div>
          <Skeleton className="h-9 w-28 bg-zinc-800" />
        </div>
        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="p-4 pb-2">
              <Skeleton className="h-4 w-20 bg-zinc-800" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-8 w-16 bg-zinc-800" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex border-b border-zinc-800 gap-6 pb-2">
          <Skeleton className="h-5 w-16 bg-zinc-800" />
          <Skeleton className="h-5 w-20 bg-zinc-800" />
          <Skeleton className="h-5 w-24 bg-zinc-800" />
          <Skeleton className="h-5 w-24 bg-zinc-800" />
        </div>

        <Card className="border-zinc-800 bg-zinc-950/40">
          <CardContent className="p-6 space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-zinc-800" />
            ))}
            <Skeleton className="h-4 w-2/3 bg-zinc-800" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
