import { SkeletonShimmer } from "../ui/skeleton";

export function SkeletonTimelineItem() {
  return (
    <div className="flex gap-4">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <SkeletonShimmer className="w-4 h-4 rounded-full flex-shrink-0" />
        <SkeletonShimmer className="w-0.5 h-full min-h-[60px] mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 space-y-2">
        <SkeletonShimmer className="h-5 w-32" />
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 space-y-3">
          <SkeletonShimmer className="h-6 w-3/4" />
          <SkeletonShimmer className="h-4 w-1/2" />
          <div className="space-y-2 pt-2">
            <SkeletonShimmer className="h-4 w-full" />
            <SkeletonShimmer className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTimeline({ count = 5 }) {
  return (
    <div className="relative space-y-0">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonTimelineItem key={index} />
      ))}
    </div>
  );
}
