export const SourcesList = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
        <span>📰</span> Related Articles & Sources
      </h3>
      <div className="space-y-3">
        {sources.map((source, index) => (
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
  );
};

export default SourcesList;
