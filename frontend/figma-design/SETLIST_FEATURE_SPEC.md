# Setlist Feature Specification

## Overview
Add a setlist display feature to the musicians performance history application. Each performance card will show a "View Setlist" button that opens a dialog modal displaying the complete list of songs performed (or planned for future events).

## Feature Description
- Each performance includes a setlist array of songs
- A "View Setlist" button appears on each performance card
- Clicking the button opens a modal dialog showing the numbered song list
- The dialog styling matches the event type (future vs past)
- Scrollable area for longer setlists
- Shows song count on the button

## Implementation Steps

### 1. Add Setlist Data to Performance Objects in `/App.tsx`

Add a `setlist` property (array of strings) to each performance object in the `performances` array:

```typescript
// Example for past event
{
  id: "1",
  artistName: "Aurora Waves",
  venue: "Madison Square Garden",
  city: "New York",
  country: "USA",
  date: "2024-09-15",
  attendees: 20000,
  genre: "Pop",
  imageUrl: "...",
  setlist: [
    "Electric Dreams",
    "City Lights",
    "Neon Hearts",
    "Midnight Run",
    "Lost in the Waves",
    "Crystal Sky",
    "Dancing Shadows",
    "Golden Hour",
    "Echoes",
    "Starlight Serenade"
  ],
}
```

**Complete Setlists for All Performances:**

**Performance ID 1 - Aurora Waves (Pop):**
```typescript
setlist: [
  "Electric Dreams",
  "City Lights",
  "Neon Hearts",
  "Midnight Run",
  "Lost in the Waves",
  "Crystal Sky",
  "Dancing Shadows",
  "Golden Hour",
  "Echoes",
  "Starlight Serenade"
],
```

**Performance ID 2 - The Midnight Echo (Rock):**
```typescript
setlist: [
  "Thunder Road",
  "Broken Chains",
  "Revolution",
  "Dark Paradise",
  "Wildfire",
  "Stone Cold",
  "Rebel Heart",
  "Highway to Nowhere"
],
```

**Performance ID 3 - Jazz Collective (Jazz):**
```typescript
setlist: [
  "Take Five",
  "Blue in Green",
  "Autumn Leaves",
  "So What",
  "Round Midnight",
  "My Favorite Things"
],
```

**Performance ID 4 - Electric Dreams (Electronic):**
```typescript
setlist: [
  "Pulse",
  "Neon Lights",
  "Digital Love",
  "Synthwave",
  "Cosmic Dance",
  "Laser Dreams",
  "Binary Sunset",
  "Aurora",
  "Infinite Loop",
  "Bass Drop",
  "Future Shock"
],
```

**Performance ID 5 - Soulful Strings (Classical):**
```typescript
setlist: [
  "Symphony No. 5 - Beethoven",
  "Clair de Lune - Debussy",
  "The Four Seasons - Vivaldi",
  "Moonlight Sonata - Beethoven",
  "Canon in D - Pachelbel"
],
```

**Performance ID 6 - Urban Beats (Hip Hop):**
```typescript
setlist: [
  "City Streets",
  "Hustle Hard",
  "Dreams & Nightmares",
  "Crown",
  "Legacy",
  "Rise Up",
  "No Limit",
  "Victory Lap"
],
```

**Performance ID 7 - Neon Lights (Pop):**
```typescript
setlist: [
  "Summer Nights",
  "Paradise",
  "Feel the Beat",
  "Dance Revolution",
  "Shine On",
  "Good Vibes",
  "Party All Night",
  "Love Struck",
  "Forever Young"
],
```

**Performance ID 8 - Indie Collective (Indie):**
```typescript
setlist: [
  "Velvet Morning",
  "Coffee Shop Dreams",
  "Bedroom Eyes",
  "Polaroid Memories",
  "Vintage Hearts",
  "Sunday Driver"
],
```

**Performance ID 9 - Cosmic Harmony (Electronic - Future Event):**
```typescript
setlist: [
  "Cosmic Overture",
  "Stellar Dreams",
  "Galaxy Pulse",
  "Quantum Leap",
  "Nebula",
  "Time Warp",
  "Celestial Vibes",
  "Event Horizon",
  "Supernova"
],
```

**Performance ID 10 - Luna Symphony (Classical - Future Event):**
```typescript
setlist: [
  "Requiem - Mozart",
  "Nocturne in E-flat - Chopin",
  "Swan Lake - Tchaikovsky",
  "Ave Maria - Schubert",
  "The Planets Suite - Holst"
],
```

**Performance ID 11 - Stellar Waves (Pop - Future Event):**
```typescript
setlist: [
  "Stardust",
  "California Dreaming",
  "Midnight Sun",
  "Ocean Eyes",
  "Gravity",
  "Fireworks",
  "Perfect Storm",
  "Euphoria"
],
```

**Performance ID 12 - Midnight Jazz Ensemble (Jazz - Future Event):**
```typescript
setlist: [
  "A Night in Tunisia",
  "Blue Train",
  "Maiden Voyage",
  "Cantaloupe Island",
  "Fly Me to the Moon",
  "All Blues"
],
```

### 2. Update PerformanceCard Component Interface

**File: `/components/PerformanceCard.tsx`**

Add required imports at the top:
```typescript
import { Calendar, MapPin, Users, Music, List } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
```

Update the interface to include the `setlist` prop:
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
  isFuture?: boolean;
  setlist?: string[]; // ADD THIS LINE
}
```

Update the function parameters to include setlist with a default empty array:
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
  isFuture = false,
  setlist = [], // ADD THIS LINE
}: PerformanceCardProps) {
```

### 3. Add Setlist Button and Dialog

Add this code **inside the `<div className="p-6 space-y-4">` section**, after the closing `</div>` of the grid containing MapPin, Calendar, and Users:

```typescript
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
```

### 4. Complete PerformanceCard Structure

After the changes, the card structure inside `<div className="p-6 space-y-4">` should look like:

```typescript
<div className="p-6 space-y-4">
  <div>
    <h3 className="text-white mb-2">{artistName}</h3>
    <p className="text-white/70">{venue}</p>
  </div>
  
  <div className="grid grid-cols-2 gap-3">
    {/* MapPin, Calendar, Users sections remain the same */}
  </div>
  
  {/* NEW: Setlist button and dialog */}
  {setlist.length > 0 && (
    <Dialog>
      {/* Dialog content as shown above */}
    </Dialog>
  )}
</div>
```

## Visual Design Specifications

### View Setlist Button
- **Width:** Full width of card (`w-full`)
- **Size:** Small (`size="sm"`)
- **Icon:** List icon from lucide-react (16px, left-aligned with 8px margin)
- **Text:** "View Setlist (X songs)" where X is the setlist length

**Past Events Button:**
- Background: `bg-purple-500/20`
- Border: `border-purple-400/40`
- Text: `text-purple-100`
- Hover: `hover:bg-purple-500/30 hover:text-purple-50`

**Future Events Button:**
- Background: `bg-cyan-500/20`
- Border: `border-cyan-400/40`
- Text: `text-cyan-100`
- Hover: `hover:bg-cyan-500/30 hover:text-cyan-50`

### Dialog Modal
- **Max Width:** 28rem (`max-w-md`)
- **Background:** Gradient from purple-900 to blue-900 to indigo-900 with 95% opacity
- **Backdrop:** Blur effect (`backdrop-blur-lg`)
- **Border:** White with 20% opacity
- **Text Color:** White

### Dialog Header
- **Title:** "Setlist" for past events, "Planned Setlist" for future events
- **Performance Details:**
  - Artist name
  - Venue • City, Country
  - Date
  - All in smaller text (`text-sm`) with white/70% opacity

### Song List
- **Container:** ScrollArea with max height of 400px
- **Spacing:** 8px gap between songs (`space-y-2`)
- **Padding:** Right padding of 16px for scrollbar (`pr-4`)

### Individual Song Item
- **Layout:** Flex row with 12px gap
- **Padding:** 12px all around
- **Background:** White 5% opacity, 10% on hover
- **Border Radius:** Large (`rounded-lg`)
- **Transition:** Colors with smooth transition

**Song Number Badge:**
- **Size:** 24px × 24px circle
- **Position:** Flex-shrink-0 (doesn't shrink)
- **Text:** Extra small centered number

For **Past Events:**
- Background: `bg-purple-500/30`
- Text: `text-purple-300`

For **Future Events:**
- Background: `bg-cyan-500/30`
- Text: `text-cyan-300`

**Song Name:**
- **Color:** White with 90% opacity
- **Flex:** Takes remaining space (`flex-1`)

## User Experience Flow

1. User views performance card
2. If setlist exists, "View Setlist" button appears at bottom of card
3. Button shows song count (e.g., "View Setlist (10 songs)")
4. User clicks button
5. Dialog modal opens with glassmorphism effect
6. Header shows performance details
7. Scrollable song list displays with numbered items
8. User can scroll through longer setlists
9. Hover effect highlights each song
10. User clicks outside or presses ESC to close

## Conditional Rendering
- Button only appears if `setlist.length > 0`
- If setlist is empty or undefined, no button is shown
- Title changes based on `isFuture` prop:
  - Past events: "Setlist"
  - Future events: "Planned Setlist"

## Shadcn/ui Components Used
- `Dialog` - Main modal component
- `DialogTrigger` - Button that opens the dialog
- `DialogContent` - Modal content container
- `DialogHeader` - Modal header section
- `DialogTitle` - Modal title text
- `ScrollArea` - Scrollable container for song list
- `Button` - View Setlist button

## Testing Checklist
After implementation, verify:
- [ ] All 12 performances have setlists added
- [ ] "View Setlist" button appears on all cards
- [ ] Button shows correct song count
- [ ] Dialog opens when button is clicked
- [ ] Past events show "Setlist" title
- [ ] Future events show "Planned Setlist" title
- [ ] Songs are numbered correctly (1, 2, 3, etc.)
- [ ] Scroll works for longer setlists
- [ ] Hover effects work on song items
- [ ] Color scheme matches event type (purple for past, cyan for future)
- [ ] Dialog closes on outside click or ESC key
- [ ] Performance details display correctly in dialog header

## Notes
- Setlist data is hardcoded in the mock data
- In a real application, this would come from an API/database
- Genre-appropriate song titles are used for each performance
- Classical performances include composer names
- Setlist length varies by genre (5-11 songs)
- The dialog is fully responsive and works on mobile devices
- ScrollArea ensures long setlists don't overflow the viewport
