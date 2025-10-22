import { SkeletonShimmer } from "../ui/skeleton";

export function SkeletonMap() {
  return (
    <div className="relative h-[600px] rounded-lg overflow-hidden border border-white/20 bg-white/5 backdrop-blur-lg">
      {/* Map skeleton with grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating marker skeletons */}
      <div className="absolute top-1/4 left-1/3">
        <SkeletonShimmer className="w-8 h-8 rounded-full" />
      </div>
      <div className="absolute top-1/2 right-1/4">
        <SkeletonShimmer className="w-8 h-8 rounded-full" />
      </div>
      <div className="absolute bottom-1/3 left-1/2">
        <SkeletonShimmer className="w-8 h-8 rounded-full" />
      </div>
      <div className="absolute top-1/3 right-1/3">
        <SkeletonShimmer className="w-8 h-8 rounded-full" />
      </div>

      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 space-y-3">
          <SkeletonShimmer className="h-4 w-48" />
          <SkeletonShimmer className="h-3 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
