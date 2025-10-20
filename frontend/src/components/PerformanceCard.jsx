import { Calendar, MapPin, Users, List } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

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
  isFuture = false,
  setlist = []
}) {
  return (
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col ${
      isFuture
        ? 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-blue-500/10 backdrop-blur-lg shadow-lg shadow-cyan-500/20'
        : 'border-white/20 bg-white/10 backdrop-blur-lg'
    }`}>
      <div className="relative h-56 overflow-hidden">
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
        <div className="absolute top-3 right-3 flex gap-2">
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

      <div className="p-3 flex flex-col h-full">
        <div className="flex-grow space-y-2">
          <div>
            <h3 className="text-white text-lg font-bold mb-0.5">{artistName}</h3>
            <p className="text-white/70 text-sm">{venue}</p>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-[auto_1fr] gap-3 items-start">
              <div className="flex items-center gap-2 text-white/80 flex-shrink-0">
                <Calendar className={`w-4 h-4 ${isFuture ? 'text-emerald-400' : 'text-blue-400'}`} />
                <span className="text-sm whitespace-nowrap">{date}</span>
              </div>

              <div className="flex items-center gap-2 text-white/80 min-w-0">
                <MapPin className={`w-4 h-4 flex-shrink-0 ${isFuture ? 'text-cyan-400' : 'text-purple-400'}`} />
                <span className="text-sm truncate">{city}{country ? `, ${country}` : ''}</span>
              </div>
            </div>

            {attendees > 0 && (
              <div className="flex items-center gap-2 text-white/80">
                <Users className={`w-4 h-4 ${isFuture ? 'text-teal-400' : 'text-pink-400'}`} />
                <span className="text-sm">{attendees.toLocaleString()} {isFuture ? 'expected' : 'attendees'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Fixed bottom section - always at the same position */}
        <div className="mt-2 space-y-1.5">
          {setlist.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full ${
                    isFuture
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/30 hover:text-cyan-50'
                      : 'bg-purple-500/20 border-purple-400/40 text-purple-100 hover:bg-purple-500/30 hover:text-purple-50'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  View Setlist ({setlist.length} songs)
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg border-white/20 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl mb-2">
                    {isFuture ? 'Planned Setlist' : 'Setlist'}
                  </DialogTitle>
                  <div className="text-white/70 space-y-1">
                    <p className="text-sm">{artistName}</p>
                    <p className="text-sm">{venue} • {city}, {country}</p>
                    <p className="text-sm">{date}</p>
                  </div>
                </DialogHeader>
                <ScrollArea className="max-h-[400px] pr-4">
                  <div className="space-y-2 mt-4">
                    {setlist.map((song, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isFuture
                            ? 'bg-cyan-500/30 text-cyan-300'
                            : 'bg-purple-500/30 text-purple-300'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-white/90 flex-1">{song}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )}

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
      </div>
    </Card>
  );
}
