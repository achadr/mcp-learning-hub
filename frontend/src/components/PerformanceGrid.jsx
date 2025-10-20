import { Music } from 'lucide-react';
import { PerformanceCard } from './PerformanceCard';
import { isFutureEvent } from '../utils/helpers';
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

  // Performances are already sorted and filtered by the hook
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {performances.map(performance => (
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
