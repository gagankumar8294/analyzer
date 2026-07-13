'use client';

import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div className="h-4 w-24 skeleton" />
        <div className="h-8 w-8 skeleton rounded-lg" />
      </div>
      <div className="h-8 w-32 skeleton mt-2" />
      <div className="h-3 w-40 skeleton mt-1" />
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="card flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full skeleton shrink-0" />
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="h-6 w-48 skeleton" />
          <div className="h-4 w-32 skeleton" />
          <div className="h-12 w-full skeleton" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 skeleton rounded-full" />
            <div className="h-6 w-24 skeleton rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1 flex flex-col gap-4">
          <div className="h-5 w-36 skeleton" />
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-3 rounded-xl" style={{ border: '1px solid var(--border-subtle)' }}>
                <div className="w-14 h-14 rounded-full skeleton" />
                <div className="h-3.5 w-16 skeleton" />
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2 flex flex-col gap-4">
          <div className="h-5 w-40 skeleton" />
          <div className="h-64 w-full skeleton mt-2" />
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 flex flex-col gap-4">
          <div className="h-5 w-32 skeleton" />
          <div className="grid grid-cols-3 gap-4 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square w-full skeleton rounded-xl" />
            ))}
          </div>
        </div>
        <div className="card lg:col-span-1 flex flex-col gap-4">
          <div className="h-5 w-36 skeleton" />
          <div className="h-48 w-full skeleton mt-2" />
          <div className="h-36 w-full skeleton mt-2" />
        </div>
      </div>
    </div>
  );
}

export function GeneralSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="card flex flex-col gap-5">
        <div className="h-6 w-48 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-[90%] skeleton" />
        <div className="h-4 w-[95%] skeleton" />
        <div className="h-4 w-[60%] skeleton" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card h-48 skeleton" />
        <div className="card h-48 skeleton" />
      </div>
    </div>
  );
}
