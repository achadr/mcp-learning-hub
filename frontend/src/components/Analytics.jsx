import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from './ui/card';
import { TrendingUp, MapPin, Users, Globe } from 'lucide-react';
import {
  prepareTimelineChartData,
  prepareTopCitiesData,
  prepareCapacityTrendsData,
  prepareGeographicData
} from '../utils/helpers';

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-lg p-3 shadow-xl">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-white/80 text-sm">
            {entry.name}: <span className="font-bold" style={{ color: entry.color }}>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Color palette
const COLORS = [
  '#a855f7', // purple-500
  '#06b6d4', // cyan-500
  '#ec4899', // pink-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

export function Analytics({ performances }) {
  const timelineData = useMemo(() => prepareTimelineChartData(performances), [performances]);
  const topCitiesData = useMemo(() => prepareTopCitiesData(performances, 10), [performances]);
  const capacityData = useMemo(() => prepareCapacityTrendsData(performances), [performances]);
  const geographicData = useMemo(() => prepareGeographicData(performances), [performances]);

  if (performances.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60">No data available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Timeline */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-white text-lg font-bold">Performance Timeline</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">Number of performances over time</p>

        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: 'white' }} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 5 }}
                activeDot={{ r: 7 }}
                name="Performances"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/40 text-center py-12">No timeline data available</p>
        )}
      </Card>

      {/* Top Cities */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white text-lg font-bold">Top Cities</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">Most visited cities by performance count</p>

        {topCitiesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topCitiesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="city"
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                width={150}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Performances" radius={[0, 8, 8, 0]}>
                {topCitiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-white/40 text-center py-12">No city data available</p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Trends */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-pink-400" />
            <h3 className="text-white text-lg font-bold">Venue Capacity Trends</h3>
          </div>
          <p className="text-white/60 text-sm mb-6">Average venue capacity over time</p>

          {capacityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="avgCapacity"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ fill: '#ec4899', r: 4 }}
                  name="Avg Capacity"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-white/40 text-center py-12">No capacity data available</p>
          )}
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white text-lg font-bold">Geographic Distribution</h3>
          </div>
          <p className="text-white/60 text-sm mb-6">Performance distribution by country</p>

          {geographicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={geographicData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ country, percent }) => `${country} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {geographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-white/40 text-center py-12">No geographic data available</p>
          )}
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-lg border-white/20 p-6">
        <h3 className="text-white text-lg font-bold mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCitiesData.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Most Visited City</p>
              <p className="text-white text-xl font-bold">{topCitiesData[0].city}</p>
              <p className="text-purple-400 text-sm">{topCitiesData[0].count} performances</p>
            </div>
          )}

          {geographicData.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Countries Visited</p>
              <p className="text-white text-xl font-bold">{geographicData.length}</p>
              <p className="text-cyan-400 text-sm">Unique countries</p>
            </div>
          )}

          {capacityData.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Average Venue Size</p>
              <p className="text-white text-xl font-bold">
                {Math.round(
                  capacityData.reduce((sum, d) => sum + d.avgCapacity, 0) / capacityData.length
                ).toLocaleString()}
              </p>
              <p className="text-pink-400 text-sm">Capacity</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
