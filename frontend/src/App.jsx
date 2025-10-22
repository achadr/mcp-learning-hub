import { useState, useEffect, useMemo } from "react";
import { Music } from "lucide-react";
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { usePerformances } from "./hooks/usePerformances";
import { SearchForm } from "./components/SearchForm";
import { LoadingState } from "./components/states/LoadingState";
import { ErrorState } from "./components/states/ErrorState";
import { EmptyState } from "./components/states/EmptyState";
import { NoResultsState } from "./components/states/NoResultsState";
import { ResultsHeader } from "./components/ResultsHeader";
import { StatsOverview } from "./components/StatsOverview";
import { PerformanceGrid } from "./components/PerformanceGrid";
import { PerformanceTimeline } from "./components/PerformanceTimeline";
import { SourcesList } from "./components/SourcesList";
import { FilterControls } from "./components/FilterControls";
import { MapView } from "./components/MapView";
import { Analytics } from "./components/Analytics";
import { SkeletonGrid } from "./components/skeletons/SkeletonCard";
import { SkeletonTimeline } from "./components/skeletons/SkeletonTimeline";
import { SkeletonMap } from "./components/skeletons/SkeletonMap";
import { SkeletonAnalytics } from "./components/skeletons/SkeletonAnalytics";
import { Pagination } from "./components/Pagination";

const ITEMS_PER_PAGE = 24; // 24 items per page

export default function App() {
  const [activeTab, setActiveTab] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    results,
    loading,
    error,
    filteredPerformances,
    stats,
    sortOrder,
    showUpcoming,
    searchPerformances,
    setSortOrder,
    setShowUpcoming,
    retryLastSearch
  } = usePerformances();

  const hasResults = results && results.performed && filteredPerformances.length > 0;

  // Reset pagination when results change or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPerformances, activeTab]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Calculate paginated data for Grid and Timeline
  const paginatedPerformances = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPerformances.slice(startIndex, endIndex);
  }, [filteredPerformances, currentPage]);

  const totalPages = Math.ceil(filteredPerformances.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-lg bg-black/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">Performance History</h1>
                <p className="text-white/60 text-sm">Track musicians across the globe</p>
              </div>
            </div>

            {/* Search Form */}
            <SearchForm onSearch={searchPerformances} loading={loading} />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Loading State with Skeletons */}
          {loading && (
            <div className="space-y-6">
              {/* Stats skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 space-y-2">
                    <div className="animate-pulse bg-white/10 h-4 w-24 rounded" />
                    <div className="animate-pulse bg-white/10 h-8 w-16 rounded" />
                  </div>
                ))}
              </div>

              {/* Tab-specific skeleton */}
              {activeTab === "grid" && <SkeletonGrid count={6} />}
              {activeTab === "timeline" && <SkeletonTimeline count={5} />}
              {activeTab === "map" && <SkeletonMap />}
              {activeTab === "analytics" && <SkeletonAnalytics />}
            </div>
          )}

          {/* Error State */}
          {error && !loading && <ErrorState error={error} onRetry={retryLastSearch} />}

          {/* No Results State */}
          {results && !loading && !results.performed && (
            <NoResultsState
              artist={results.artist}
              location={results.location}
            />
          )}

          {/* Empty State */}
          {!results && !loading && !error && (
            <EmptyState onSampleSearch={searchPerformances} />
          )}

          {/* Results with Stats and Performances */}
          {hasResults && !loading && (
            <>
              {/* Result Header */}
              <ResultsHeader
                artist={results.artist}
                location={results.location || 'the specified location'}
                message={results.message}
              />

              {/* Stats Overview */}
              <StatsOverview stats={stats} />

              {/* Filter Controls */}
              <div className="mb-6">
                <FilterControls
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  showUpcoming={showUpcoming}
                  onShowUpcomingChange={setShowUpcoming}
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white/10 backdrop-blur-lg border-white/20">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="map" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-6">
                  <PerformanceGrid performances={paginatedPerformances} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredPerformances.length}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <PerformanceTimeline performances={paginatedPerformances} />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredPerformances.length}
                  />
                </TabsContent>

                <TabsContent value="map" className="space-y-6">
                  <MapView performances={filteredPerformances} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Analytics performances={filteredPerformances} />
                </TabsContent>
              </Tabs>

              {/* Sources Section */}
              <SourcesList sources={results.sources} />
            </>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}
