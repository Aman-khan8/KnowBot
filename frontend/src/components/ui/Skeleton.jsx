import React from 'react'

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-[#1C1C20] rounded-[8px] ${className}`}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-[#161619] border border-[#2A2A2F] rounded-[10px] p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-[#202024]">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/5 ml-auto" />
    </div>
  )
}
