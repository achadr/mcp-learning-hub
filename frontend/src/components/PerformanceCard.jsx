import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function PerformanceCard({
  artistName,
  venue,
  city,
  country,
  date,
  attendees,
  genre,
  imageUrl,
  setlistUrl,
  isFuture = false
}) {
  return (
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
      isFuture
        ? 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-blue-500/10 backdrop-blur-lg shadow-lg shadow-cyan-500/20'
        : 'border-white/20 bg-white/10 backdrop-blur-lg'
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80"}
          alt={`${artistName} at ${venue}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80";
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isFuture
            ? 'from-cyan-900/80 via-emerald-900/40 to-transparent'
            : 'from-black/80 via-black/40 to-transparent'
        }`} />
        <div className="absolute top-4 right-4 flex gap-2">
          {isFuture && (
            <Badge className="bg-gradient-to-r from-cyan-500 to-emerald-500 border-cyan-300/30 backdrop-blur-sm animate-pulse">
              Upcoming
            </Badge>
          )}
          {genre && (
            <Badge className={`backdrop-blur-sm border-white/20 ${
              isFuture
                ? 'bg-cyan-500/90'
                : 'bg-purple-500/90'
            }`}>
              {genre}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">{artistName}</h3>
          <p className="text-white/70">{venue}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className={`w-4 h-4 ${isFuture ? 'text-cyan-400' : 'text-purple-400'}`} />
            <span className="text-sm">{city}{country ? `, ${country}` : ''}</span>
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <Calendar className={`w-4 h-4 ${isFuture ? 'text-emerald-400' : 'text-blue-400'}`} />
            <span className="text-sm">{date}</span>
          </div>

          {attendees > 0 && (
            <div className="flex items-center gap-2 text-white/80 col-span-2">
              <Users className={`w-4 h-4 ${isFuture ? 'text-teal-400' : 'text-pink-400'}`} />
              <span className="text-sm">{attendees.toLocaleString()} {isFuture ? 'expected' : 'attendees'}</span>
            </div>
          )}
        </div>

        {setlistUrl && (
          <a
            href={setlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            View Details →
          </a>
        )}
      </div>
    </Card>
  );
}
