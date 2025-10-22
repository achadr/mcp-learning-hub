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

export default function App() {
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
    setShowUpcoming
  } = usePerformances();

  const hasResults = results && results.performed && filteredPerformances.length > 0;

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
          {/* Loading State */}
          {loading && <LoadingState />}

          {/* Error State */}
          {error && !loading && <ErrorState error={error} />}

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
              <Tabs defaultValue="grid" className="space-y-6">
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
                  <PerformanceGrid performances={filteredPerformances} />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <PerformanceTimeline performances={filteredPerformances} />
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
