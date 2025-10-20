export const ErrorState = ({ error }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-lg rounded-2xl p-8">
        <h3 className="text-red-400 font-bold text-xl mb-2">Error</h3>
        <p className="text-white/80">{error}</p>
      </div>
    </div>
  );
};

export default ErrorState;
