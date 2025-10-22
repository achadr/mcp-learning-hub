import { Card } from "../ui/card";
import { SkeletonShimmer } from "../ui/skeleton";

export function SkeletonChart({ title, height = 300 }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <SkeletonShimmer className="w-5 h-5" />
        <SkeletonShimmer className="h-5 w-48" />
      </div>
      <SkeletonShimmer className="h-3 w-64 mb-6" />

      {/* Chart area with bars/lines pattern */}
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end justify-around gap-2 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonShimmer
              key={i}
              className="w-full"
              style={{ height: `${Math.random() * 60 + 40}%` }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

export function SkeletonAnalytics() {
  return (
    <div className="space-y-6">
      {/* Performance Timeline */}
      <SkeletonChart title="Performance Timeline" height={300} />

      {/* Top Cities */}
      <SkeletonChart title="Top Cities" height={400} />

      {/* Two column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart title="Capacity Trends" height={250} />

        {/* Pie chart skeleton */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <SkeletonShimmer className="w-5 h-5" />
            <SkeletonShimmer className="h-5 w-48" />
          </div>
          <SkeletonShimmer className="h-3 w-64 mb-6" />
          <div className="flex items-center justify-center" style={{ height: 250 }}>
            <SkeletonShimmer className="w-40 h-40 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <SkeletonShimmer className="h-5 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 space-y-2">
              <SkeletonShimmer className="h-3 w-24" />
              <SkeletonShimmer className="h-6 w-32" />
              <SkeletonShimmer className="h-3 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
