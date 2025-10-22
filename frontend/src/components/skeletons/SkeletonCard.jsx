import { Card } from "../ui/card";
import { SkeletonShimmer } from "../ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-white/20 bg-white/10 backdrop-blur-lg flex flex-col">
      {/* Image skeleton */}
      <SkeletonShimmer className="h-56 w-full rounded-none" />

      <div className="p-3 flex flex-col h-full space-y-3">
        {/* Title and venue */}
        <div className="space-y-2">
          <SkeletonShimmer className="h-6 w-3/4" />
          <SkeletonShimmer className="h-4 w-1/2" />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <SkeletonShimmer className="h-4 w-full" />
          <SkeletonShimmer className="h-4 w-4/5" />
          <SkeletonShimmer className="h-4 w-2/3" />
        </div>

        {/* Button skeleton */}
        <div className="mt-auto pt-2">
          <SkeletonShimmer className="h-9 w-full" />
        </div>
      </div>
    </Card>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
