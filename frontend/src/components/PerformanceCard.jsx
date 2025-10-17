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
  setlistUrl
}) {
  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-white/20 bg-white/10 backdrop-blur-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80"}
          alt={`${artistName} at ${venue}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1566735355837-2269c24e644e?w=1080&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {genre && (
          <Badge className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-sm border-white/20">
            {genre}
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">{artistName}</h3>
          <p className="text-white/70">{venue}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-sm">{city}{country ? `, ${country}` : ''}</span>
          </div>

          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm">{date}</span>
          </div>

          {attendees > 0 && (
            <div className="flex items-center gap-2 text-white/80 col-span-2">
              <Users className="w-4 h-4 text-pink-400" />
              <span className="text-sm">{attendees.toLocaleString()} attendees</span>
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
