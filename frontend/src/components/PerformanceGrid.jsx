import { Music } from 'lucide-react';
import { PerformanceCard } from './PerformanceCard';
import { isFutureEvent, sortByUpcomingFirst } from '../utils/helpers';
import { MESSAGES } from '../constants';

export const PerformanceGrid = ({ performances }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedPerformances.map(performance => (
        <PerformanceCard
          key={performance.id}
          {...performance}
          isFuture={isFutureEvent(performance.date)}
        />
      ))}
    </div>
  );
};

export default PerformanceGrid;
