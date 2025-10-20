import { MESSAGES } from '../../constants';

export const LoadingState = ({ message = MESSAGES.LOADING }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default LoadingState;
