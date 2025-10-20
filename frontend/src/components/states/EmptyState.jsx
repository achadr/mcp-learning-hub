import { SAMPLE_QUERIES, MESSAGES } from '../../constants';

export const EmptyState = ({ onSampleSearch }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl mb-6">🎸</div>
      <h2 className="text-3xl font-bold text-white mb-3">
        Ready to discover concerts?
      </h2>
      <p className="text-white/70 text-lg max-w-md mb-6">
        {MESSAGES.SEARCH_PROMPT}
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        {SAMPLE_QUERIES.map((query, index) => (
          <button
            key={index}
            onClick={() => onSampleSearch(query.artist, query.country)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg text-white transition-all"
          >
            Try: {query.artist} in {query.country}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
