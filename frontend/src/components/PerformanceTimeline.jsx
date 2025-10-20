import { Music } from 'lucide-react';
import { PerformanceCard } from './PerformanceCard';
import { isFutureEvent, sortByUpcomingFirst } from '../utils/helpers';
import { MESSAGES } from '../constants';

export const PerformanceTimeline = ({ performances }) => {
  if (performances.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
        <p className="text-white/60">{MESSAGES.NO_FILTER_MATCH}</p>
      </div>
    );
  }

  // Sort performances: upcoming first (soonest), then past (newest)
  const sortedPerformances = sortByUpcomingFirst(performances);

  return (
    <div className="space-y-6">
      {sortedPerformances.map((performance, index) => (
        <div key={performance.id} className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
            {index < sortedPerformances.length - 1 && (
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
  );
};

export default PerformanceTimeline;
