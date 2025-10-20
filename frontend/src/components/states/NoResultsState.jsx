import { MESSAGES } from '../../constants';

export const NoResultsState = ({ artist, location }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-white font-bold text-2xl mb-2">
          {MESSAGES.NO_RESULTS}
        </h3>
        <p className="text-white/70">
          No records found for {artist} {location ? `in ${location}` : ''}
        </p>
      </div>
    </div>
  );
};

export default NoResultsState;
