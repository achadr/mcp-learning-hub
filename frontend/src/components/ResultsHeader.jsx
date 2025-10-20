export const ResultsHeader = ({ artist, location, message }) => {
  return (
    <div className="mb-8">
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;
