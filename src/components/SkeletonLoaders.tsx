import React from 'react';

/**
 * Reusable, high-fidelity Skeleton Loading components for PAMUR Portal.
 * Uses Tailwind's animate-pulse and subtle zinc/slate gradients for smooth loading states.
 */

export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
    {/* Top Image Placeholder */}
    <div className="aspect-[16/9] w-full bg-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="absolute top-3 left-3 h-5 w-24 bg-slate-300/80 rounded-md" />
    </div>

    {/* Content Skeleton */}
    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-2.5">
        <div className="h-4 w-1/3 bg-slate-200 rounded" />
        <div className="h-6 w-full bg-slate-200 rounded" />
        <div className="h-6 w-4/5 bg-slate-200 rounded" />
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full bg-slate-100 rounded" />
          <div className="h-3.5 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Meta Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0" />
          <div className="h-3.5 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-3.5 w-16 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

export const ArticleDetailSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
    {/* Back button skeleton */}
    <div className="h-9 w-28 bg-slate-200 rounded-xl" />

    {/* Hero Header Skeleton */}
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="aspect-[21/9] sm:aspect-[16/7] w-full bg-slate-200" />
      <div className="p-6 sm:p-8 space-y-4">
        <div className="h-5 w-32 bg-slate-200 rounded-md" />
        <div className="h-8 sm:h-10 w-full bg-slate-200 rounded-lg" />
        <div className="h-8 sm:h-10 w-3/4 bg-slate-200 rounded-lg" />
        
        <div className="flex items-center gap-4 pt-2">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>

    {/* Body text paragraphs skeleton */}
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
      <div className="h-4 w-full bg-slate-100 rounded" />
      <div className="h-4 w-11/12 bg-slate-100 rounded" />
      <div className="h-4 w-4/5 bg-slate-100 rounded" />
      <div className="h-4 w-full bg-slate-100 rounded pt-2" />
      <div className="h-4 w-9/12 bg-slate-100 rounded" />
    </div>
  </div>
);

export const ScheduleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs animate-pulse space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-28 bg-red-100 rounded-md" />
        <div className="h-5 w-4/5 bg-slate-200 rounded" />
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>

    <div className="space-y-2.5 py-1">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-slate-200" />
        <div className="h-3.5 w-36 bg-slate-200 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-slate-200" />
        <div className="h-3.5 w-48 bg-slate-100 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-slate-200" />
        <div className="h-3.5 w-32 bg-slate-100 rounded" />
      </div>
    </div>

    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
      <div className="h-4 w-24 bg-slate-200 rounded" />
      <div className="h-9 w-32 bg-red-200/80 rounded-xl" />
    </div>
  </div>
);

export const GalleryItemSkeleton: React.FC = () => (
  <div className="aspect-square rounded-2xl bg-slate-200 border border-slate-200/80 overflow-hidden relative animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
  </div>
);

export const TableRowsSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-1/3 bg-slate-200 rounded" />
          <div className="h-3 w-1/4 bg-slate-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-md shrink-0" />
        <div className="h-8 w-16 bg-slate-200 rounded-lg shrink-0" />
      </div>
    ))}
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-3.5 w-24 bg-slate-200 rounded" />
      <div className="w-8 h-8 rounded-xl bg-slate-100" />
    </div>
    <div className="h-7 w-20 bg-slate-300 rounded-lg" />
    <div className="h-3 w-32 bg-slate-100 rounded" />
  </div>
);

export const MemberProfileSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
    {/* Profile Header Skeleton */}
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
      <div className="w-24 h-24 rounded-2xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2.5 text-center sm:text-left w-full">
        <div className="h-6 w-48 bg-slate-300 rounded mx-auto sm:mx-0" />
        <div className="h-4 w-32 bg-slate-200 rounded mx-auto sm:mx-0" />
        <div className="h-3.5 w-56 bg-slate-100 rounded mx-auto sm:mx-0" />
      </div>
      <div className="h-10 w-32 bg-slate-200 rounded-xl shrink-0" />
    </div>

    {/* KTA Preview Skeleton */}
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="h-5 w-40 bg-slate-200 rounded" />
      <div className="aspect-[1.586/1] max-w-md mx-auto bg-slate-200 rounded-2xl" />
      <div className="flex justify-center gap-3 pt-2">
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);

