# Musicians Performance History - Project Context

## Project Overview

This is a **Musicians Performance History Tracker** - a beautiful, interactive web application for tracking and visualizing musician performances across different countries and cities worldwide. The application features stunning glassmorphism design, gradient backgrounds, and smooth animations.

**Live Demo Features:**
- 📊 Real-time statistics dashboard
- 🗺️ Filter performances by country
- 🔍 Search by artist, city, or venue
- 🎨 Two view modes: Grid and Timeline
- 📱 Fully responsive design
- ✨ Beautiful gradient backgrounds with glassmorphism effects

---

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** Shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useMemo)
- **Build Tool:** Vite (assumed)

---

## Architecture

### Design System

**Color Palette:**
- Primary gradient: Purple (900) → Blue (900) → Indigo (900)
- Accent colors: Purple-500, Pink-500, Blue-400, Pink-400
- Glass effects: White with 10-20% opacity + backdrop blur
- Text: White with varying opacity (100%, 80%, 70%, 60%)

**Visual Style:**
- **Glassmorphism:** Frosted glass effect with backdrop-blur
- **Gradients:** Extensive use of color gradients for depth
- **Hover Effects:** Scale, shadow, and color transitions
- **Responsive Grid:** 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)

### Component Architecture

```
App.tsx (Main Container)
├── Header (Logo + Title)
├── Stats Overview (4 StatsCard components)
├── Filters (Search Input + Country Select)
└── Tabs (Grid View / Timeline View)
    └── Performance Cards (PerformanceCard components)
```

---

## Data Model

### Performance Object

```typescript
interface Performance {
  id: string;                    // Unique identifier
  artistName: string;            // Name of the musician/band
  venue: string;                 // Performance venue name
  city: string;                  // City where performance took place
  country: string;               // Country code/name
  date: string;                  // ISO date format (YYYY-MM-DD)
  attendees: number;             // Number of attendees
  genre: string;                 // Music genre (Pop, Rock, Jazz, etc.)
  imageUrl: string;              // Unsplash image URL
}
```

### Sample Data Structure

Currently uses **8 mock performances** with data from:
- 🇺🇸 USA (New York, Indio, Los Angeles)
- 🇬🇧 UK (London)
- 🇯🇵 Japan (Tokyo)
- 🇦🇺 Australia (Sydney)
- 🇩🇪 Germany (Berlin)
- 🇧🇷 Brazil (São Paulo)

---

## Key Components

### 1. **App.tsx** (Main Component)

**Responsibilities:**
- State management for filters (country, search)
- Performance data filtering logic
- Statistics calculation
- Layout orchestration

**State:**
```typescript
const [selectedCountry, setSelectedCountry] = useState<string>("all");
const [searchQuery, setSearchQuery] = useState<string>("");
```

**Computed Values:**
```typescript
const filteredPerformances = useMemo(() => {
  // Filters by country AND search query
});

const stats = useMemo(() => {
  // Calculates: totalPerformances, totalAttendees, uniqueCities, uniqueCountries
});
```

**Key Features:**
- Multi-criteria filtering (country + search)
- Real-time stats calculation
- Tab switching (Grid/Timeline views)
- Responsive container layout

---

### 2. **PerformanceCard.tsx**

**Purpose:** Displays individual performance information in a beautiful card format.

**Props:**
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
}
```

**Visual Features:**
- Image with gradient overlay
- Genre badge (top-right)
- Hover effects (scale image, shadow)
- Icon-labeled information (location, date, attendees)
- Glassmorphism card background

**Icons Used:**
- 📍 MapPin (location)
- 📅 Calendar (date)
- 👥 Users (attendees)
- 🎵 Music (genre badge)

---

### 3. **StatsCard.tsx**

**Purpose:** Displays a single statistic with icon, label, value, and optional trend.

**Props:**
```typescript
interface StatsCardProps {
  icon: LucideIcon;              // Icon component from lucide-react
  label: string;                 // Stat description
  value: string | number;        // Main stat value
  trend?: string;                // Optional trend text (e.g., "+12% this month")
  iconColor: string;             // Tailwind color class for icon background
}
```

**Visual Features:**
- Icon in colored circle (top-right)
- Large value display
- Optional green trend indicator
- Glassmorphism background
- Hover state (brightness increase)

**Used For:**
- Total Performances (blue icon)
- Total Attendees (purple icon)
- Cities (pink icon)
- Countries (indigo icon)

---

### 4. **ImageWithFallback.tsx**

**Purpose:** Custom image component with fallback handling (prevents broken images).

**Location:** `/components/figma/ImageWithFallback.tsx`

**Usage:**
```typescript
<ImageWithFallback
  src={imageUrl}
  alt="Description"
  className="w-full h-full object-cover"
/>
```

**Note:** This is a Figma Make system component - do not modify.

---

## UI Components Library (Shadcn/ui)

### Currently Used Components:

1. **Card** (`card.tsx`)
   - Used for: PerformanceCard, StatsCard
   - Variants: Card, CardHeader, CardContent, CardFooter

2. **Badge** (`badge.tsx`)
   - Used for: Genre tags
   - Style: Semi-transparent with backdrop blur

3. **Tabs** (`tabs.tsx`)
   - Used for: Grid/Timeline view switching
   - Components: Tabs, TabsList, TabsTrigger, TabsContent

4. **Select** (`select.tsx`)
   - Used for: Country filter dropdown
   - Custom styling: Glassmorphism background

5. **Input** (`input.tsx`)
   - Used for: Search bar
   - Custom styling: Glassmorphism background, white text

### Available But Unused Components:

You have access to 40+ additional Shadcn components in `/components/ui/`:
- Forms: `checkbox`, `radio-group`, `textarea`, `form`
- Navigation: `navigation-menu`, `breadcrumb`, `menubar`, `pagination`
- Feedback: `alert`, `toast/sonner`, `progress`, `skeleton`
- Overlays: `dialog`, `sheet`, `drawer`, `popover`, `tooltip`, `hover-card`
- Data: `table`, `calendar`, `chart`, `carousel`
- Layout: `separator`, `resizable`, `scroll-area`, `sidebar`, `accordion`, `collapsible`

---

## Styling System

### Global Styles (`styles/globals.css`)

**Important Notes:**
- Uses Tailwind CSS v4.0 (CSS-first configuration)
- Default typography is set per HTML element
- **DO NOT use** font-size, font-weight, or line-height Tailwind classes unless specifically requested
- Custom CSS variables for theming available

### Tailwind Usage Patterns

**Glassmorphism Pattern:**
```css
bg-white/10 backdrop-blur-lg border-white/20
```

**Gradient Backgrounds:**
```css
bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900
```

**Hover Effects:**
```css
hover:scale-110 transition-transform duration-500
hover:shadow-2xl transition-all duration-300
```

**Responsive Grid:**
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## Key Features Explained

### 1. **Multi-Filter System**

Two independent filters working together:

```typescript
const filteredPerformances = performances.filter(p => {
  const matchesCountry = selectedCountry === "all" || p.country === selectedCountry;
  const matchesSearch = searchQuery === "" || 
    p.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.venue.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCountry && matchesSearch;
});
```

**Search covers:** Artist name, city, venue (case-insensitive)

---

### 2. **Dynamic Statistics**

Statistics update automatically based on filtered results:

```typescript
const stats = useMemo(() => {
  const totalPerformances = filteredPerformances.length;
  const totalAttendees = filteredPerformances.reduce((sum, p) => sum + p.attendees, 0);
  const uniqueCities = new Set(filteredPerformances.map(p => p.city)).size;
  const uniqueCountries = new Set(filteredPerformances.map(p => p.country)).size;
  
  return { totalPerformances, totalAttendees, uniqueCities, uniqueCountries };
}, [filteredPerformances]);
```

**Performance:** Uses `useMemo` to prevent unnecessary recalculations.

---

### 3. **View Modes**

#### **Grid View:**
- Standard card grid layout
- 1-3 columns responsive
- Best for browsing

#### **Timeline View:**
- Chronological sort (newest first)
- Numbered circles with connecting lines
- Gradient connector lines
- Best for historical context

**Implementation:**
```typescript
<Tabs defaultValue="grid">
  <TabsContent value="grid">
    {/* Grid of cards */}
  </TabsContent>
  <TabsContent value="timeline">
    {/* Timeline with numbered indicators */}
  </TabsContent>
</Tabs>
```

---

### 4. **Empty States**

Graceful handling when no results found:

```typescript
{filteredPerformances.length === 0 ? (
  <div className="text-center py-12">
    <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
    <p className="text-white/60">No performances found</p>
  </div>
) : (
  // Render cards
)}
```

---

## How to Extend

### Adding New Performance Data

**Option 1: Hardcoded Data**
Add to the `performances` array in `App.tsx`:

```typescript
const performances = [
  // ... existing data
  {
    id: "9",
    artistName: "Your Artist",
    venue: "Venue Name",
    city: "City",
    country: "Country",
    date: "2024-10-15",
    attendees: 5000,
    genre: "Genre",
    imageUrl: "https://images.unsplash.com/photo-...",
  },
];
```

**Option 2: API Integration**
Replace hardcoded array with API fetch:

```typescript
const [performances, setPerformances] = useState([]);

useEffect(() => {
  fetch('/api/performances')
    .then(res => res.json())
    .then(data => setPerformances(data));
}, []);
```

---

### Adding New Filters

**Example: Add Genre Filter**

1. Add state:
```typescript
const [selectedGenre, setSelectedGenre] = useState<string>("all");
```

2. Update filter logic:
```typescript
const matchesGenre = selectedGenre === "all" || p.genre === selectedGenre;
return matchesCountry && matchesSearch && matchesGenre;
```

3. Add Select component:
```tsx
<Select value={selectedGenre} onValueChange={setSelectedGenre}>
  {/* Genre options */}
</Select>
```

---

### Adding New Statistics

**Example: Add Average Attendance**

```typescript
const stats = useMemo(() => {
  // ... existing stats
  const averageAttendance = totalPerformances > 0 
    ? Math.round(totalAttendees / totalPerformances) 
    : 0;
  
  return { 
    ...existing, 
    averageAttendance 
  };
}, [filteredPerformances]);
```

Then add a new `StatsCard`:
```tsx
<StatsCard
  icon={TrendingUp}
  label="Avg. Attendance"
  value={stats.averageAttendance.toLocaleString()}
  iconColor="bg-green-500"
/>
```

---

### Customizing Visuals

**Change Gradient Colors:**

In `App.tsx`, update the main background:
```tsx
<div className="min-h-screen bg-gradient-to-br from-[YOUR-COLOR] via-[YOUR-COLOR] to-[YOUR-COLOR]">
```

**Change Accent Colors:**

Update the icon colors in `StatsCard` calls:
```typescript
iconColor="bg-YOUR-COLOR-500"  // Will automatically apply to text too
```

**Modify Card Styles:**

In `PerformanceCard.tsx`, adjust the Card className:
```tsx
className="... bg-white/[YOUR-OPACITY] backdrop-blur-[YOUR-BLUR] ..."
```

---

## Image Handling

### Using Unsplash Images

Current images are from Unsplash API. To add new images:

1. **In Development:** Use `unsplash_tool` (Figma Make only)
2. **In Production:** Replace with your own image URLs

**Image Requirements:**
- Aspect ratio: 16:9 or similar landscape
- Resolution: Minimum 1080px width
- Format: JPG, PNG, WebP

**Image Sources:**
- Unsplash (free)
- Your own uploads
- CDN-hosted images

---

## Performance Considerations

### Current Optimizations

1. **useMemo for Filtering:**
   - Prevents re-filtering on every render
   - Only recalculates when country or search changes

2. **useMemo for Statistics:**
   - Prevents re-calculation on every render
   - Only updates when filtered results change

3. **Key Props:**
   - Every mapped element has unique `key={performance.id}`
   - Ensures efficient React reconciliation

### Potential Improvements

**For Large Datasets (100+ performances):**

1. **Virtualization:**
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual'
   ```

2. **Pagination:**
   - Add page state
   - Slice filtered results
   - Use Shadcn `pagination` component

3. **Debounced Search:**
   ```typescript
   import { useDebouncedValue } from './hooks/useDebouncedValue'
   const debouncedSearch = useDebouncedValue(searchQuery, 300);
   ```

4. **Lazy Loading Images:**
   - Add `loading="lazy"` to images
   - Implement intersection observer

---

## Common Modifications

### Change Date Format

Currently displays: `2024-09-15`

To change to "Sep 15, 2024":

```typescript
const formattedDate = new Date(date).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
```

Use in PerformanceCard:
```tsx
<span className="text-sm">{formattedDate}</span>
```

---

### Add Sorting Options

Add dropdown to sort performances:

```typescript
const [sortBy, setSortBy] = useState<'date' | 'attendees' | 'name'>('date');

const sortedPerformances = [...filteredPerformances].sort((a, b) => {
  if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
  if (sortBy === 'attendees') return b.attendees - a.attendees;
  if (sortBy === 'name') return a.artistName.localeCompare(b.artistName);
  return 0;
});
```

---

### Add Detail View

Create a modal/sheet to show full performance details:

```tsx
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";

<Sheet>
  <SheetTrigger asChild>
    <button>View Details</button>
  </SheetTrigger>
  <SheetContent>
    {/* Detailed performance info */}
  </SheetContent>
</Sheet>
```

---

## File Organization Best Practices

### Current Structure ✅

```
/components
  /ui           → Shadcn components (don't modify directly)
  /figma        → System components (don't modify)
  *.tsx         → Custom application components
/styles         → Global CSS
App.tsx         → Main entry point
```

### If Expanding:

```
/components
  /ui           → Shadcn components
  /figma        → System components
  /features
    /performances
      PerformanceCard.tsx
      PerformanceList.tsx
      PerformanceDetail.tsx
    /stats
      StatsCard.tsx
      StatsOverview.tsx
  /layout
    Header.tsx
    Footer.tsx
/hooks
  usePerformances.ts
  useFilters.ts
/utils
  formatters.ts
  constants.ts
/types
  performance.ts
```

---

## API Integration Guide

### Converting to Real Data

**Step 1: Create API Service**

```typescript
// /services/api.ts
export async function fetchPerformances() {
  const response = await fetch('https://your-api.com/performances');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

**Step 2: Update App.tsx**

```typescript
import { useState, useEffect } from 'react';
import { fetchPerformances } from './services/api';

export default function App() {
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformances()
      .then(data => setPerformances(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // ... rest of component
}
```

**Step 3: Add Loading States**

Use Shadcn `skeleton` component:

```tsx
import { Skeleton } from "./components/ui/skeleton";

{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-64 w-full" />
    ))}
  </div>
) : (
  // Render actual cards
)}
```

---

## Testing Suggestions

### Manual Testing Checklist

- [ ] Filters work independently
- [ ] Filters work together (country + search)
- [ ] Stats update when filtering
- [ ] Both view modes display correctly
- [ ] Empty state shows when no results
- [ ] Responsive on mobile (320px+)
- [ ] Responsive on tablet (768px+)
- [ ] Responsive on desktop (1024px+)
- [ ] Images load properly
- [ ] Hover effects work
- [ ] Search is case-insensitive
- [ ] Date sorting works in timeline view

### Unit Test Examples (if adding tests)

```typescript
describe('Performance Filtering', () => {
  it('filters by country', () => {
    const filtered = performances.filter(p => p.country === 'USA');
    expect(filtered).toHaveLength(3);
  });

  it('searches across multiple fields', () => {
    const query = 'madison';
    const filtered = performances.filter(p => 
      p.venue.toLowerCase().includes(query)
    );
    expect(filtered.length).toBeGreaterThan(0);
  });
});
```

---

## Troubleshooting

### Common Issues

**Issue: Images not loading**
- Check ImageWithFallback is imported correctly
- Verify image URLs are accessible
- Check for CORS issues in browser console

**Issue: Filters not working**
- Verify state is updating (`console.log` the state)
- Check filter logic for typos
- Ensure `useMemo` dependencies are correct

**Issue: Styles not applying**
- Check Tailwind classes are valid
- Verify `globals.css` is imported in main entry
- Clear browser cache

**Issue: Components not rendering**
- Check for TypeScript errors
- Verify all imports are correct
- Check React DevTools for component tree

---

## Environment Setup

### Required Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-label": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

---

## Design Tokens Reference

### Spacing Scale
- Gaps: 3, 4, 6 (0.75rem, 1rem, 1.5rem)
- Padding: 4, 6 (1rem, 1.5rem)
- Margins: 2, 4, 8 (0.5rem, 1rem, 2rem)

### Border Radius
- Cards: `rounded-xl` (0.75rem)
- Badges: default
- Icons containers: `rounded-xl` (0.75rem)

### Opacity Scale
- Text primary: 100% (text-white)
- Text secondary: 80% (text-white/80)
- Text tertiary: 70% (text-white/70)
- Text muted: 60% (text-white/60)
- Backgrounds: 10-20% (bg-white/10, bg-white/20)

### Transition Durations
- Fast: 300ms
- Medium: 500ms
- Slow: 1000ms

---

## Future Enhancement Ideas

### Short Term
- [ ] Add export to CSV functionality
- [ ] Add print-friendly view
- [ ] Implement genre filter
- [ ] Add date range picker
- [ ] Show performance on map (integrate mapping library)

### Medium Term
- [ ] Add user authentication
- [ ] Allow users to add/edit performances
- [ ] Add photo upload for performances
- [ ] Implement analytics dashboard
- [ ] Add social sharing

### Long Term
- [ ] Multi-artist tracking
- [ ] Revenue tracking
- [ ] Ticketing integration
- [ ] Mobile app (React Native)
- [ ] Calendar integration

---

## Accessibility Notes

### Current Accessibility Features
- ✅ Semantic HTML (header, main, nav implied)
- ✅ Color contrast ratios (white on dark backgrounds)
- ✅ Icons have descriptive context
- ✅ Interactive elements are keyboard accessible (Radix UI)

### Recommended Improvements
- [ ] Add ARIA labels to filter controls
- [ ] Add skip-to-content link
- [ ] Ensure focus indicators are visible
- [ ] Add screen reader announcements for filter changes
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)

### ARIA Label Examples

```tsx
<Input
  type="text"
  placeholder="Search..."
  aria-label="Search performances by artist, city, or venue"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

<Select 
  value={selectedCountry} 
  onValueChange={setSelectedCountry}
  aria-label="Filter performances by country"
>
  {/* ... */}
</Select>
```

---

## Version History

**v1.0.0** - Initial Release
- Grid and timeline views
- Country and search filters
- 8 sample performances
- Glassmorphism design
- Responsive layout

---

## Credits & Attribution

**UI Components:** Shadcn/ui (https://ui.shadcn.com)
**Icons:** Lucide React (https://lucide.dev)
**Images:** Unsplash (https://unsplash.com)
**Styling:** Tailwind CSS (https://tailwindcss.com)

---

## Support & Contribution

### Getting Help
- Check this documentation first
- Review component source code in `/components`
- Check Shadcn/ui docs for UI component APIs
- Review Tailwind CSS docs for styling

### Making Changes
1. Always test changes in both view modes
2. Test responsive breakpoints (mobile, tablet, desktop)
3. Verify filters still work after modifications
4. Check for console errors
5. Ensure TypeScript types are correct

---

## Quick Reference

### Key State Variables
```typescript
selectedCountry: string          // "all" | country name
searchQuery: string              // Search input value
filteredPerformances: Performance[]   // Filtered results
stats: { total, attendees, cities, countries }
```

### Key Functions
```typescript
setSelectedCountry(country)      // Update country filter
setSearchQuery(query)            // Update search
useMemo(() => filter logic)      // Auto-recalculates filtered data
useMemo(() => stats calc)        // Auto-recalculates statistics
```

### Important Files
- `App.tsx` - Main logic & layout
- `PerformanceCard.tsx` - Card component
- `StatsCard.tsx` - Statistic display
- `globals.css` - Global styles & typography

### Color Shortcuts
```css
/* Backgrounds */
bg-white/10 backdrop-blur-lg     /* Glass effect */
bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900  /* Main gradient */

/* Text */
text-white                       /* Primary text */
text-white/70                    /* Secondary text */

/* Accents */
bg-purple-500  text-purple-400   /* Primary accent */
bg-blue-500    text-blue-400     /* Info */
bg-pink-500    text-pink-400     /* Location */
```

---

## Contact Context

**Project Type:** Musicians Performance History Tracker
**Framework:** React + TypeScript + Tailwind CSS
**UI Library:** Shadcn/ui + Radix UI
**Current Status:** Production-ready prototype with mock data
**Next Steps:** API integration, additional features, testing

---

**Last Updated:** October 17, 2025
**Documentation Version:** 1.0.0
