import { Calendar, Users, MapPin, Globe } from 'lucide-react';
import { StatsCard } from './StatsCard';

export const StatsOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon={Calendar}
        label="Total Performances"
        value={stats.totalPerformances}
        trend={`${stats.totalPerformances} shows found`}
        iconColor="bg-blue-500"
      />
      <StatsCard
        icon={MapPin}
        label="Cities"
        value={stats.uniqueCities}
        iconColor="bg-pink-500"
      />
      <StatsCard
        icon={Globe}
        label="Countries"
        value={stats.uniqueCountries}
        iconColor="bg-indigo-500"
      />
    </div>
  );
};

export default StatsOverview;
