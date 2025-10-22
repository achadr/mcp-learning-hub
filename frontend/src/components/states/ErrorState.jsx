import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-lg rounded-2xl p-8">
        <h3 className="text-red-400 font-bold text-xl mb-2">Error</h3>
        <p className="text-white/80 mb-4">{error}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
