import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full" | "xl" | "2xl";
}

const roundedClasses = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", width, height, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={`bg-brand-border/50 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 && lines > 1 ? "75%" : "100%"}
          rounded="md"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-brand-border/50 p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <Skeleton width={44} height={44} rounded="xl" />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} width="40%" rounded="md" />
          <Skeleton height={20} width="60%" rounded="md" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-brand-border/50 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-brand-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            height={14}
            width={i === 0 ? 120 : 80}
            rounded="md"
            className="flex-shrink-0"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 px-4 py-3 border-b border-brand-border/50 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height={16}
              width={colIndex === 0 ? 140 : 70}
              rounded="md"
              className="flex-shrink-0"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonDonut({
  size = 200,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <Skeleton width={size} height={size} rounded="full" />
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton width={12} height={12} rounded="full" />
            <Skeleton width={60} height={14} rounded="md" />
          </div>
        ))}
      </div>
    </div>
  );
}
