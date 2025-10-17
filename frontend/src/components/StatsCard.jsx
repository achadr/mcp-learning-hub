import { Card } from "./ui/card";

export function StatsCard({ icon: Icon, label, value, trend, iconColor }) {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-white/70 text-sm">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
          {trend && (
            <p className="text-green-400 text-sm">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${iconColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </Card>
  );
}
