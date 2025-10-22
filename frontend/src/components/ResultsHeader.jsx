export const ResultsHeader = ({ artist, location, message, totalAvailable, cached, loadedCount }) => {
  return (
    <div className="mb-8">
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-4xl">
              ✅
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold z-0">
                Yes! {artist} has performed in {location}
              </h2>
              {message && (
                <p className="text-white/70 mt-1">{message}</p>
              )}
              {/* Show total available if different from loaded count */}
              {totalAvailable && totalAvailable > loadedCount && (
                <p className="text-white/60 text-sm mt-2">
                  Showing {loadedCount} of ~{totalAvailable} total performances
                </p>
              )}
            </div>
          </div>

          {/* Cached badge */}
          {cached && (
            <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-1.5">
              <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-blue-200 text-sm font-medium">Cached</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
