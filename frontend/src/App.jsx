import { Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
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

export default function App() {
  const {
    results,
    loading,
    error,
    searchQuery,
    filteredPerformances,
    stats,
    searchPerformances,
    setSearchQuery
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

              {/* Filter within results */}
              {filteredPerformances.length > 3 && (
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Filter results by city, venue, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="grid" className="space-y-6">
                <TabsList className="bg-white/10 backdrop-blur-lg border-white/20">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Grid View
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                    Timeline
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-6">
                  <PerformanceGrid performances={filteredPerformances} />
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <PerformanceTimeline performances={filteredPerformances} />
                </TabsContent>
              </Tabs>

              {/* Sources Section */}
              <SourcesList sources={results.sources} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
