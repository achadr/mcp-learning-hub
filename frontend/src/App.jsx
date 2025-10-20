import { useState, useMemo, useEffect } from "react";
import { Music, MapPin, Calendar, Users, Globe, Search } from "lucide-react";
import { PerformanceCard } from "./components/PerformanceCard";
import { StatsCard } from "./components/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to check if event is in the future
const isFutureEvent = (dateString) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  return eventDate >= today;
};

export default function App() {
  const [artist, setArtist] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artistFocused, setArtistFocused] = useState(false);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [countryFocused, setCountryFocused] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [loadingCountrySuggestions, setLoadingCountrySuggestions] = useState(false);

  // Extract performances from API results
  const performances = useMemo(() => {
    if (!results || !results.performed || !results.events) return [];

    return results.events.map((event, index) => ({
      id: String(index),
      artistName: results.artist || artist,
      venue: event.venue || 'Unknown Venue',
      city: event.location || event.city || '',
      country: event.country || country || results.location || '',
      date: event.date || 'Unknown Date',
      attendees: event.attendees || 0,
      genre: event.genre || 'Music',
      imageUrl: event.imageUrl || 'https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80',
      setlistUrl: event.setlistUrl || event.url || '',
    }));
  }, [results, artist, country]);

  // Fetch artist suggestions from API with debouncing
  useEffect(() => {
    // Only fetch if user has typed 3+ characters
    if (!artist.trim() || artist.trim().length < 3) {
      setArtistSuggestions([]);
      return;
    }

    // Debounce: Wait 300ms after user stops typing
    const timeoutId = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/autocomplete`, {
          params: { q: artist.trim() }
        });
        setArtistSuggestions(response.data);
      } catch (err) {
        console.error('Failed to fetch artist suggestions:', err);
        setArtistSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    // Cleanup function to cancel the timeout if user keeps typing
    return () => clearTimeout(timeoutId);
  }, [artist]);

  // Fetch country suggestions from API with debouncing
  useEffect(() => {
    // Only fetch if user has typed 2+ characters
    if (!country.trim() || country.trim().length < 2) {
      setCountrySuggestions([]);
      return;
    }

    // Debounce: Wait 300ms after user stops typing
    const timeoutId = setTimeout(async () => {
      setLoadingCountrySuggestions(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/autocomplete/countries`, {
          params: { q: country.trim() }
        });
        setCountrySuggestions(response.data);
      } catch (err) {
        console.error('Failed to fetch country suggestions:', err);
        setCountrySuggestions([]);
      } finally {
        setLoadingCountrySuggestions(false);
      }
    }, 300);

    // Cleanup function to cancel the timeout if user keeps typing
    return () => clearTimeout(timeoutId);
  }, [country]);

  // Filter performances by search query
  const filteredPerformances = useMemo(() => {
    if (!searchQuery.trim()) return performances;

    const query = searchQuery.toLowerCase();
    return performances.filter(p =>
      p.artistName.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.venue.toLowerCase().includes(query) ||
      p.country.toLowerCase().includes(query)
    );
  }, [performances, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalPerformances = filteredPerformances.length;
    const totalAttendees = filteredPerformances.reduce((sum, p) => sum + p.attendees, 0);
    const uniqueCities = new Set(filteredPerformances.map(p => p.city).filter(Boolean)).size;
    const uniqueCountries = new Set(filteredPerformances.map(p => p.country).filter(Boolean)).size;

    return {
      totalPerformances,
      totalAttendees,
      uniqueCities: uniqueCities || 0,
      uniqueCountries: uniqueCountries || 0,
    };
  }, [filteredPerformances]);

  const handleSearch = async () => {
    if (!artist.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);
    setSearchQuery("");

    try {
      const params = new URLSearchParams();
      params.append('artist', artist.trim());
      if (country.trim()) {
        params.append('country', country.trim());
      }

      const response = await axios.get(`${API_BASE_URL}/performances?${params}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data. Make sure the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

            {/* Search */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Input
                  type="text"
                  placeholder="Artist name (e.g., Coldplay, Taylor Swift)..."
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setArtistFocused(true)}
                  onBlur={() => setTimeout(() => setArtistFocused(false), 200)}
                  className="w-full bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50"
                  disabled={loading}
                />
                {/* Autocomplete Suggestions */}
                {artistFocused && (loadingSuggestions || artistSuggestions.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-[9999]">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-white/60 text-sm">
                        Searching artists...
                      </div>
                    ) : artistSuggestions.length > 0 ? (
                      artistSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setArtist(suggestion);
                            setArtistFocused(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))
                    ) : artist.length >= 3 && (
                      <div className="px-4 py-3 text-white/60 text-sm">
                        No artists found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Country (optional, e.g., US, Brazil)"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setCountryFocused(true)}
                  onBlur={() => setTimeout(() => setCountryFocused(false), 200)}
                  className="w-full bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/50"
                  disabled={loading}
                />
                {/* Country Autocomplete Suggestions */}
                {countryFocused && (loadingCountrySuggestions || countrySuggestions.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-[9999]">
                    {loadingCountrySuggestions ? (
                      <div className="px-4 py-3 text-white/60 text-sm">
                        Searching countries...
                      </div>
                    ) : countrySuggestions.length > 0 ? (
                      countrySuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCountry(suggestion);
                            setCountryFocused(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))
                    ) : country.length >= 2 && (
                      <div className="px-4 py-3 text-white/60 text-sm">
                        No countries found
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !artist.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-lg">Searching across multiple data sources...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-lg rounded-2xl p-8">
                <h3 className="text-red-400 font-bold text-xl mb-2">Error</h3>
                <p className="text-white/80">{error}</p>
              </div>
            </div>
          )}

          {/* No Results State */}
          {results && !loading && !results.performed && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-white font-bold text-2xl mb-2">
                  No performances found
                </h3>
                <p className="text-white/70">
                  {results.message || `No records found for ${results.artist} in ${results.location || 'the specified location'}`}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!results && !loading && !error && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="text-8xl mb-6">🎸</div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to discover concerts?
              </h2>
              <p className="text-white/70 text-lg max-w-md mb-6">
                Search for your favorite artist above to see where they've performed around the world
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  onClick={() => { setArtist("Coldplay"); setCountry("US"); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg text-white transition-all"
                >
                  Try: Coldplay in US
                </button>
                <button
                  onClick={() => { setArtist("Taylor Swift"); setCountry("France"); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg text-white transition-all"
                >
                  Try: Taylor Swift in France
                </button>
              </div>
            </div>
          )}

          {/* Results with Stats and Performances */}
          {results && results.performed && performances.length > 0 && !loading && (
            <>
              {/* Result Header */}
              <div className="mb-8">
                <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-4xl">
                      ✅
                    </div>
                    <div>
                      <h2 className="text-white text-2xl font-bold z-0">
                        Yes! {results.artist} has performed in {results.location || country}
                      </h2>
                      {results.message && (
                        <p className="text-white/70 mt-1">{results.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  icon={Calendar}
                  label="Total Performances"
                  value={stats.totalPerformances}
                  trend={`${stats.totalPerformances} shows found`}
                  iconColor="bg-blue-500"
                />
                <StatsCard
                  icon={Users}
                  label="Total Attendees"
                  value={stats.totalAttendees > 0 ? stats.totalAttendees.toLocaleString() : 'N/A'}
                  trend={stats.totalAttendees > 0 ? "Estimated" : "Data not available"}
                  iconColor="bg-purple-500"
                />
                <StatsCard
                  icon={MapPin}
                  label="Cities"
                  value={stats.uniqueCities}
                  iconColor="bg-pink-500"
                />
                <StatsCard
                  icon={Globe}
                  label="Countries"
                  value={stats.uniqueCountries}
                  iconColor="bg-indigo-500"
                />
              </div>

              {/* Filter within results */}
              {performances.length > 3 && (
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
                  {filteredPerformances.length === 0 ? (
                    <div className="text-center py-12">
                      <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">No performances match your filter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPerformances.map(performance => (
                        <PerformanceCard
                          key={performance.id}
                          {...performance}
                          isFuture={isFutureEvent(performance.date)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  {filteredPerformances.length === 0 ? (
                    <div className="text-center py-12">
                      <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">No performances match your filter</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredPerformances
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((performance, index) => (
                          <div key={performance.id} className="flex gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              {index < filteredPerformances.length - 1 && (
                                <div className="w-0.5 flex-1 bg-gradient-to-b from-purple-500 to-transparent mt-2 min-h-[40px]" />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <PerformanceCard
                                {...performance}
                                isFuture={isFutureEvent(performance.date)}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Sources Section */}
              {results.sources && results.sources.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>📰</span> Related Articles & Sources
                  </h3>
                  <div className="space-y-3">
                    {results.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-lg rounded-xl p-4 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🔗</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold mb-1">{source.title}</h4>
                            {source.description && (
                              <p className="text-white/70 text-sm line-clamp-2">{source.description}</p>
                            )}
                            <p className="text-white/50 text-xs mt-1">{source.source || 'External Source'}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
