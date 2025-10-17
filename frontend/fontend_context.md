# 🎵 Musician Performance Tracker — Frontend Context (UI Specification)

## 🧠 Overview

This document defines the **frontend implementation details** for the "Musician Performance Tracker" web app.
The backend and API are already functional — this context focuses exclusively on the **user interface** and **interaction design**.

**Technology Stack:**
- **Framework:** React 19.1.1 with Vite
- **Styling:** TailwindCSS 4.1.14 with custom gradients and glassmorphism
- **HTTP Client:** Axios 1.12.2
- **Theme:** Purple/pink gradient with glassmorphic design

The app layout consists of **two columns**:
- **Left column:** Fixed search panel with header, search form, and footer
- **Right column:** Scrollable results area with event cards and article links

The design features **modern glassmorphism**, gradient accents, smooth animations, and responsive layouts suitable for all screen sizes.

---

## 🧩 Layout Structure

### General Layout

The main page uses a **full-screen flex layout** with two fixed-height columns. The left column contains the search interface, while the right column scrolls independently to display results.

```jsx
<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
  {/* Background Pattern */}
  <div className="fixed inset-0 bg-[url(...)] opacity-40 -z-10"></div>

  <div className="relative flex h-screen overflow-hidden">
    {/* Left Column - Search */}
    <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col border-r border-gray-200/50 bg-white/20 backdrop-blur-sm">
      {/* Header, Search Form, Footer */}
    </div>

    {/* Right Column - Results */}
    <div className="flex-1 overflow-y-auto">
      {/* Results Content */}
    </div>
  </div>
</div>
```

---

## 🔍 Left Column — Search Panel

### Purpose
Provide an intuitive interface for the user to:
- Enter an artist name (required) with **autocomplete suggestions**
- Enter a country name (optional)
- Quick-search popular artists with preset buttons
- Trigger a search request

### Behavior
- **Autocomplete:** As the user types, suggestions appear after 2+ characters with 300ms debounce
- **Keyboard Navigation:** Arrow keys navigate suggestions, Enter selects, Escape closes
- **Search Trigger:** `handleSearch()` calls `/api/performances` endpoint
- **Loading State:** Inputs disabled, spinner shown during search
- **Auto-close:** Autocomplete closes on outside click or selection

### UI Components

**SearchBar Component** (`components/SearchBar.jsx`)

```jsx
<div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Artist Input with Autocomplete */}
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={artist}
        onChange={handleArtistChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Coldplay, Taylor Swift, The Beatles"
        className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
        autoComplete="off"
      />

      {/* Autocomplete Dropdown */}
      {showAutocomplete && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border-2 border-purple-200">
          <ul className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li onClick={() => handleSelectSuggestion(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {/* Country Input */}
    <input
      type="text"
      value={country}
      placeholder="e.g., US, France, Brazil, UK"
      className="w-full pl-14 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl"
    />

    {/* Search Button */}
    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
      Search Performances
    </button>

    {/* Popular Searches */}
    <div className="grid grid-cols-1 gap-2">
      {/* Coldplay, Taylor Swift, The Beatles, BTS preset buttons */}
    </div>
  </form>
</div>
```

**Custom Hook** (`hooks/useAutocomplete.js`)
- Debounced API calls (300ms)
- Request cancellation on new input
- Returns: `{ suggestions, loading, error }`

---

## 🪄 Right Column — Results Section

### Purpose
- Display aggregated performance data from **4 sources** (Setlist.fm, Ticketmaster, Wikipedia, News API)
- Show event cards with dates, venues, cities, and confidence levels
- Display related articles and news sources

### Behavior
- **Dynamic Updates:** Results update instantly when new data arrives
- **Empty State:** Shows friendly message with guitar emoji when no search performed
- **Error State:** Displays error card with warning icon
- **Loading State:** Shows spinner animation during API calls
- **Smooth Animations:** Fade-in and staggered card appearances

### UI Components

**Results Component** (`components/Results.jsx`)

```jsx
<div className="space-y-6 animate-fade-in">
  {/* Header Card */}
  <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
        ✅
      </div>
      <h2 className="text-2xl font-black">
        Yes! <span className="text-purple-600">{artist}</span> has performed in {location}
      </h2>
      <div className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
        {events.length} performances found
      </div>
    </div>
  </div>

  {/* Event Cards Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
    {events.map((event, index) => (
      <EventCard key={index} event={event} index={index} />
    ))}
  </div>
</div>
```

**EventCard Component** (`components/EventCard.jsx`)

```jsx
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all">
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>

  <div className="p-6">
    {/* Date & Confidence Badge */}
    <div className="flex justify-between">
      <span className="font-bold text-purple-700">{date}</span>
      <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">high</span>
    </div>

    {/* Venue */}
    <h4 className="font-bold text-gray-900 text-lg">{venue}</h4>

    {/* Location */}
    <p className="text-gray-600">📍 {city}, {country}</p>

    {/* Source Link */}
    <a href={sourceUrl} target="_blank" className="text-purple-600 hover:text-purple-800">
      View Details →
    </a>
  </div>
</div>
```

---

## ⚙️ Interaction Flow

### 1. Initial State
- Search inputs empty in left column
- Right column displays **empty state** with guitar emoji and friendly message:
  ```
  "Ready to discover concerts?
  Search for your favorite artist to see where they've performed"
  ```
- No loading indicators or errors visible

### 2. User Types Artist Name
- **Autocomplete activates** after 2+ characters
- Suggestions dropdown appears below input
- User can:
  - Continue typing to filter suggestions
  - Use ↑↓ arrow keys to navigate
  - Press Enter to select highlighted suggestion
  - Click a suggestion with mouse
  - Press Escape to close dropdown

### 3. User Submits Search
- Form validation: Artist field must not be empty
- Submit triggers via:
  - Click "Search Performances" button
  - Press Enter in any input field
  - Click a popular search preset button

### 4. Loading State
- Right column shows spinner with message:
  ```
  "Searching across multiple data sources...
  This may take a few seconds"
  ```
- Search inputs disabled in left column
- Autocomplete dropdown closes

### 5. Results Display
- **On Success:**
  - Header card shows artist name, location, and event count
  - Event cards appear in responsive grid with staggered animation
  - Up to 30 events displayed with "+X more" indicator
  - Related articles section below events

- **On No Data:**
  - Header card shows "No records found for {artist} in {location}"
  - Gray X emoji instead of green checkmark
  - No event cards displayed

- **On Error:**
  - Red error card with warning emoji
  - Error message: "Oops! Something went wrong"
  - Detailed error text below

### 6. Card Interactions
- **Hover Effects:** Cards lift slightly (`hover:scale-[1.02]`) with enhanced shadow
- **External Links:** "View Details →" button opens source URL in new tab
- **Confidence Badges:** Color-coded (green/yellow/gray) based on data reliability
- **Source Attribution:** Each card shows data source (Setlist.fm, Ticketmaster, etc.)

---

## 💅 Visual Design Guidelines

| Element | Style |
|---------|-------|
| **Font** | System sans-serif (default) |
| **Background** | Gradient: `from-indigo-100 via-purple-50 to-pink-100` |
| **Primary Colors** | Purple `#9333ea`, Pink `#ec4899`, Indigo `#6366f1` |
| **Glassmorphism** | `bg-white/80 backdrop-blur-xl` |
| **Gradients** | Triple gradient: `from-purple-600 via-pink-600 to-indigo-600` |
| **Border Radius** | Large: `rounded-2xl` (16px), Extra: `rounded-3xl` (24px) |
| **Shadows** | Layered: `shadow-2xl` with gradient blur effects |
| **Spacing** | Consistent: `gap-4` (1rem), `gap-6` (1.5rem) |
| **Animations** | `animate-fade-in`, staggered delays, `transition-all` |
| **Responsiveness** | Breakpoints: `lg:` (1024px), `xl:` (1280px), `2xl:` (1536px) |

### Design Patterns
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur
- **Gradient Accents:** Thin gradient lines at top of cards
- **Glow Effects:** Blurred gradient shadows behind key elements
- **Smooth Transitions:** All interactive elements have 200-300ms transitions
- **Emoji Icons:** Used for visual interest and quick recognition

---

## 🧠 React Implementation (App.jsx)

```jsx
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (artist, country) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const params = new URLSearchParams()
      params.append('artist', artist)
      if (country) {
        params.append('country', country)
      }

      const response = await axios.get(`${API_BASE_URL}/performances?${params}`)
      setResults(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data. Make sure the backend server is running.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Right Column */}
      <div className="flex-1 overflow-y-auto">
        {loading && <LoadingSpinner />}
        {error && <ErrorCard message={error} />}
        {!results && !loading && !error && <EmptyState />}
        {results && !loading && <Results data={results} />}
      </div>
    </div>
  )
}
```

---

## ✅ Summary of Deliverables

The frontend includes:

### Core Features
- ✅ **Responsive two-column layout** with fixed left panel and scrollable right panel
- ✅ **Autocomplete search** with debounced API calls and keyboard navigation
- ✅ **Popular search presets** for quick testing (Coldplay, Taylor Swift, The Beatles, BTS)
- ✅ **Dynamic results grid** with responsive columns (1-3 cols depending on screen size)
- ✅ **Multiple data sources** aggregated from Setlist.fm, Ticketmaster, Wikipedia, News API

### UI Components
- ✅ `App.jsx` - Main application with state management
- ✅ `SearchBar.jsx` - Search form with autocomplete
- ✅ `Results.jsx` - Results display with header and grid
- ✅ `EventCard.jsx` - Individual performance cards
- ✅ `SourceLink.jsx` - Related article links
- ✅ `useAutocomplete.js` - Custom hook for debounced autocomplete

### Design Elements
- ✅ **Glassmorphism** with backdrop blur and transparency
- ✅ **Purple/pink gradient theme** throughout the app
- ✅ **Smooth animations** with fade-in, staggered delays, and hover effects
- ✅ **Clear state management** for loading, empty, error, and success states
- ✅ **Confidence indicators** on event cards (high/medium/low)
- ✅ **Source attribution** for data transparency

### User Experience
- ✅ Intuitive search with real-time suggestions
- ✅ Clear visual feedback for all states
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ External links open in new tabs
- ✅ Accessible keyboard navigation

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # Search form with autocomplete
│   │   ├── Results.jsx          # Results container
│   │   ├── EventCard.jsx        # Performance card
│   │   └── SourceLink.jsx       # Article link component
│   ├── hooks/
│   │   └── useAutocomplete.js   # Debounced autocomplete hook
│   ├── App.jsx                  # Main application
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind imports
├── package.json                 # Dependencies
└── vite.config.js              # Vite configuration
```

---

## 🚀 API Integration

### Endpoints Used
- `GET /api/performances?artist=<name>&country=<country>` - Main search
- `GET /api/autocomplete?q=<query>` - Artist suggestions
- `GET /api/health` - Health check

### Data Flow
1. User types → `useAutocomplete` hook → `GET /api/autocomplete`
2. User submits → `handleSearch()` → `GET /api/performances`
3. Response → State update → UI renders results

This context document reflects the **actual production implementation** of the Concert Finder frontend, built with React, TailwindCSS, and modern UI patterns.