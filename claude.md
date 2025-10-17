# 🎵 Music Performance Tracker — Project Context (claude.md)

## 🧩 Overview
This project is a **web application** that allows users to discover **where musicians have performed** around the world.  
Users can type the **name of an artist** and optionally a **country**, and the app will tell them:
- Whether the artist **has performed** in that country.
- Provide **supporting articles, events, or tour listings** related to those performances.
- Display relevant **links, sources, and event details** visually (timeline, map, or cards).

---

## 🚀 Key Features
1. **Search interface** for artists and countries.
2. **Data fetching** from public APIs (no custom database required).
3. **Intelligent analysis** combining multiple data sources (concert databases, Wikipedia, and news articles).
4. **Optional MCP (Model Context Protocol) integration** to query structured APIs or augment the model’s responses.
5. **Results visualization** using cards, tables, or map displays.

---

## 🔍 Example User Queries
| User Input | Expected Output |
|-------------|----------------|
| “Did Coldplay perform in Brazil?” | ✅ Yes — Coldplay performed in São Paulo and Rio de Janeiro in 2023. [Official Tour Page](https://www.coldplay.com/tour/), [BBC Article](https://www.bbc.com/...) |
| “Taylor Swift France” | ✅ Yes — Taylor Swift performed in Paris in May 2024. [Le Monde Article](https://www.lemonde.fr/...) |
| “Arctic Monkeys Japan” | ❌ No official record of Arctic Monkeys performing in Japan (as of 2025). |
| “Billie Eilish” | Returns a list of countries and cities she’s performed in recently with event links. |

---

## 🧠 How the App Works

1. **User Search**
   - The frontend has a search bar: `artist` + optional `country`.
   - Example query: “Coldplay Brazil”.

2. **Data Fetching via External APIs**
   - The app doesn’t store data in a database.
   - Instead, it fetches live data from:
     - **Songkick API** – global concert data.  
       👉 `https://api.songkick.com/api/3.0/artists/{artist_id}/calendar.json?apikey=YOUR_KEY`
     - **Ticketmaster API** – event search by keyword and country.  
       👉 `https://app.ticketmaster.com/discovery/v2/events.json?keyword={artist}&countryCode={country}&apikey=YOUR_KEY`
     - **Wikipedia API** – artist’s tour and concert information.  
       👉 `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={artist}+tour&format=json`
     - **News API** – related news articles.  
       👉 `https://newsapi.org/v2/everything?q={artist}+{country}+concert&apiKey=YOUR_KEY`

3. **Data Aggregation**
   - Results are combined in a unified structure:
     ```json
     {
       "artist": "Coldplay",
       "country": "Brazil",
       "performed": true,
       "sources": [
         {"title": "Coldplay in São Paulo", "url": "https://www.bbc.com/..."},
         {"title": "Coldplay Tour Dates", "url": "https://www.coldplay.com/tour/"}
       ]
     }
     ```

4. **Frontend Display**
   - Render results as cards:
     - ✅ Performed — show event dates, venues, and links.
     - ❌ Not found — show message and relevant “no match” info.
   - Include buttons for:
     - “Show all performances”
     - “Open Wikipedia article”
     - “Read related news”

---

## ⚙️ Suggested Tech Stack

### Frontend
- **React + TailwindCSS**
- **Framer Motion** for animations
- **Axios** for API calls

### Backend (optional)
this part is not important for the momemnt I just wrote it here If we want to hide API keys in the future so our solution will be compatible with that use case if needed:
- Small **Express server** to handle API requests and combine results.
- Example endpoint:
  ```js
  GET /api/performances?artist={artist}&country={country}
