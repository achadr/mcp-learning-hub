/**
 * Base Skeleton component for loading states
 */
export function Skeleton({ className = "", width, height, ...props }) {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}

/**
 * Skeleton with shimmer effect
 */
export function SkeletonShimmer({ className = "", width, height, ...props }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/10 rounded ${className}`}
      style={{ width, height }}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
