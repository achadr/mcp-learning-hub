# Upcoming Events Feature Specification

## Overview
Add visual differentiation between future events and past performances in the musicians performance history application. Future events should have a distinct, brighter appearance with cyan/emerald color scheme.

## Implementation Steps

### 1. Add Future Event Data to `/App.tsx`

Add these 4 new performance entries to the existing `performances` array:

```typescript
{
  id: "9",
  artistName: "Cosmic Harmony",
  venue: "The Sphere",
  city: "Las Vegas",
  country: "USA",
  date: "2025-11-15",
  attendees: 18000,
  genre: "Electronic",
  imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzYwNTk3ODc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
},
{
  id: "10",
  artistName: "Luna Symphony",
  venue: "Red Rocks Amphitheatre",
  city: "Morrison",
  country: "USA",
  date: "2025-12-08",
  attendees: 9500,
  genre: "Classical",
  imageUrl: "https://images.unsplash.com/photo-1566735355837-2269c24e644e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjA2OTMxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
},
{
  id: "11",
  artistName: "Stellar Waves",
  venue: "Hollywood Bowl",
  city: "Los Angeles",
  country: "USA",
  date: "2026-01-20",
  attendees: 17500,
  genre: "Pop",
  imageUrl: "https://images.unsplash.com/photo-1595422656857-ced3a4a0ce25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrJTIwbXVzaWNpYW4lMjBwZXJmb3JtaW5nfGVufDF8fHx8MTc2MDcwMzc0NHww&ixlib=rb-4.1.0&q=80&w=1080",
},
{
  id: "12",
  artistName: "Midnight Jazz Ensemble",
  venue: "Carnegie Hall",
  city: "New York",
  country: "USA",
  date: "2026-03-05",
  attendees: 2800,
  genre: "Jazz",
  imageUrl: "https://images.unsplash.com/photo-1503853585905-d53f628e46ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXp6JTIwbXVzaWNpYW58ZW58MXx8fHwxNzYwNzAzNzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
}
```

### 2. Add Helper Function in `/App.tsx`

Add this function **before** the `export default function App()` line:

```typescript
// Helper function to check if event is in the future
const isFutureEvent = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare only dates
  return eventDate >= today;
};
```

### 3. Update PerformanceCard Calls in `/App.tsx`

**For Grid View** (around line 240):
```typescript
// FIND:
{filteredPerformances.map(performance => (
  <PerformanceCard key={performance.id} {...performance} />
))}

// REPLACE WITH:
{filteredPerformances.map(performance => (
  <PerformanceCard 
    key={performance.id} 
    {...performance} 
    isFuture={isFutureEvent(performance.date)}
  />
))}
```

**For Timeline View** (around line 268):
```typescript
// FIND:
<div className="flex-1 pb-8">
  <PerformanceCard {...performance} />
</div>

// REPLACE WITH:
<div className="flex-1 pb-8">
  <PerformanceCard 
    {...performance} 
    isFuture={isFutureEvent(performance.date)}
  />
</div>
```

### 4. Update PerformanceCard Interface in `/components/PerformanceCard.tsx`

Add the `isFuture` prop to the interface:

```typescript
interface PerformanceCardProps {
  id: string;
  artistName: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  attendees: number;
  genre: string;
  imageUrl: string;
  isFuture?: boolean; // ADD THIS LINE
}
```

### 5. Update PerformanceCard Function Signature

```typescript
export function PerformanceCard({
  artistName,
  venue,
  city,
  country,
  date,
  attendees,
  genre,
  imageUrl,
  isFuture = false, // ADD THIS LINE
}: PerformanceCardProps) {
```

### 6. Update Card Component Styling in `/components/PerformanceCard.tsx`

Replace the `<Card>` opening tag with:

```typescript
<Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
  isFuture 
    ? 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-blue-500/10 backdrop-blur-lg shadow-lg shadow-cyan-500/20' 
    : 'border-white/20 bg-white/10 backdrop-blur-lg'
}`}>
```

### 7. Update Image Overlay Gradient

Replace the gradient div inside the image container:

```typescript
<div className={`absolute inset-0 bg-gradient-to-t ${
  isFuture 
    ? 'from-cyan-900/80 via-emerald-900/40 to-transparent' 
    : 'from-black/80 via-black/40 to-transparent'
}`} />
```

### 8. Update Badge Section

Replace the Badge section (previously single Badge) with:

```typescript
<div className="absolute top-4 right-4 flex gap-2">
  {isFuture && (
    <Badge className="bg-gradient-to-r from-cyan-500 to-emerald-500 border-cyan-300/30 backdrop-blur-sm animate-pulse">
      Upcoming
    </Badge>
  )}
  <Badge className={`backdrop-blur-sm border-white/20 ${
    isFuture 
      ? 'bg-cyan-500/90' 
      : 'bg-purple-500/90'
  }`}>
    {genre}
  </Badge>
</div>
```

### 9. Update Icon Colors

Replace the icon sections with conditional colors:

**MapPin Icon:**
```typescript
<MapPin className={`w-4 h-4 ${isFuture ? 'text-cyan-400' : 'text-purple-400'}`} />
```

**Calendar Icon:**
```typescript
<Calendar className={`w-4 h-4 ${isFuture ? 'text-emerald-400' : 'text-blue-400'}`} />
```

**Users Icon:**
```typescript
<Users className={`w-4 h-4 ${isFuture ? 'text-teal-400' : 'text-pink-400'}`} />
```

### 10. Update Attendees Text

Replace the attendees span:

```typescript
<span className="text-sm">{attendees.toLocaleString()} {isFuture ? 'expected' : 'attendees'}</span>
```

## Visual Differences Summary

### Future Events:
- **Border:** Cyan with 40% opacity (`border-cyan-400/40`)
- **Background:** Gradient from cyan to emerald to blue with glassmorphism
- **Shadow:** Glowing cyan shadow (`shadow-cyan-500/20`)
- **Badge:** "Upcoming" badge with gradient (cyan to emerald) with pulse animation
- **Genre Badge:** Cyan background (`bg-cyan-500/90`)
- **Image Overlay:** Cyan/emerald gradient
- **Icons:** Cyan, emerald, and teal colors
- **Text:** Shows "expected" instead of "attendees"

### Past Events:
- **Border:** White with 20% opacity (`border-white/20`)
- **Background:** White with 10% opacity and glassmorphism
- **Shadow:** Default shadow
- **Badge:** No "Upcoming" badge
- **Genre Badge:** Purple background (`bg-purple-500/90`)
- **Image Overlay:** Black gradient
- **Icons:** Purple, blue, and pink colors
- **Text:** Shows "attendees"

## Testing
After implementation, you should see:
- 4 new events with future dates appear in the grid and timeline views
- Future events have a cyan/emerald color scheme with an "Upcoming" pulsing badge
- Past events maintain the original purple/pink color scheme
- The visual distinction is clear and immediately noticeable

## Notes
- The date comparison is done at the component level using today's date (October 20, 2025 as reference)
- All future dates are set to 2025-2026 to ensure they appear as upcoming
- The animate-pulse class on the "Upcoming" badge provides a subtle pulsing effect
