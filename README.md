# 🎵 Musician Performance Lookup

A dual-mode application for looking up musician performances around the world. Features both an **MCP server** (for Claude) and an **HTTP/REST API** (for web apps) using shared service architecture.

## 🌟 Features

- **Real API Integration**: Fetches live data from Songkick, Ticketmaster, Wikipedia, and News API
- **Dual Interface**: Use via MCP (Claude Desktop/CLI) or HTTP REST API (for web frontends)
- **Shared Services**: Write once, use everywhere - services power both MCP and HTTP
- **Smart Aggregation**: Combines results from multiple sources with deduplication
- **Source Citations**: Returns article links and sources for each performance

## 📦 What's Inside

### MCP Server
Talk to Claude and ask about musician performances:
- "Has Taylor Swift performed in France?"
- "Look up Coldplay concerts in Brazil"

### HTTP REST API
Build web apps that query musician data:
- `GET /api/performances?artist=Coldplay&country=Brazil`
- Returns JSON with events, dates, venues, and sources

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configure API Keys

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
SONGKICK_API_KEY=your_key_here
TICKETMASTER_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
PORT=3000
```

**Get API Keys:**
- Songkick: https://www.songkick.com/developer
- Ticketmaster: https://developer.ticketmaster.com/ (use **Consumer Key**, not Consumer Secret)
- News API: https://newsapi.org/

### 3. Build

```bash
npm run build
```

### 4. Run

**Option A - HTTP Server (for web apps):**
```bash
npm run start:http
```
Then open http://localhost:3000

**Option B - MCP Server (for Claude):**
```bash
npm run start:mcp
```
Or configure in Claude Desktop (see below)

## 🤖 Using with Claude Desktop

Add to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "musician-lookup": {
      "command": "node",
      "args": [
        "C:\\Users\\achra\\Desktop\\My-projects\\mcp-hub\\build\\mcp-server.js"
      ]
    }
  }
}
```

Restart Claude Desktop and try:
- "Has Taylor Swift performed in France?"
- "Look up The Beatles performances in USA"

## 🌐 Using the HTTP API

### Start the server:
```bash
npm run start:http
```

### Endpoints:

**1. Health Check**
```bash
GET /api/health
```
Returns API status and configured services.

**2. Search Performances**
```bash
GET /api/performances?artist=Coldplay&country=Brazil
```

**Response:**
```json
{
  "artist": "Coldplay",
  "location": "Brazil",
  "performed": true,
  "events": [
    {
      "date": "2023-10-13",
      "venue": "Allianz Parque",
      "city": "São Paulo",
      "country": "Brazil",
      "source": "Songkick",
      "sourceUrl": "https://...",
      "confidence": "high"
    }
  ],
  "sources": [
    {
      "title": "Coldplay announces Brazil tour",
      "url": "https://...",
      "type": "news",
      "publishedDate": "2023-08-15"
    }
  ]
}
```

**3. Quick Summary**
```bash
GET /api/summary?artist=Taylor%20Swift&country=France
```

Returns plain text summary.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Shared Services                      │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────┐ │
│  │Songkick  │ │Ticketmaster│ │Wikipedia │ │ News │ │
│  └──────────┘ └────────────┘ └──────────┘ └──────┘ │
│                     ▲                                 │
│                     │                                 │
│              ┌──────┴──────┐                         │
│              │  Aggregator │                         │
│              └──────┬──────┘                         │
└─────────────────────┼─────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
   ┌─────────┐               ┌──────────┐
   │   MCP   │               │  HTTP    │
   │  Server │               │  Server  │
   └─────────┘               └──────────┘
        │                           │
        ▼                           ▼
  ┌──────────┐             ┌───────────────┐
  │  Claude  │             │  Web Frontend │
  │ Desktop  │             │  (React, etc) │
  └──────────┘             └───────────────┘
```

## 📂 Project Structure

```
mcp-hub/
├── src/
│   ├── config.ts              # Configuration & env variables
│   ├── types.ts               # Shared TypeScript types
│   ├── mcp-server.ts          # MCP server (for Claude)
│   ├── http-server.ts         # HTTP/Express server (for web)
│   └── services/
│       ├── songkick.ts        # Songkick API integration
│       ├── ticketmaster.ts    # Ticketmaster API integration
│       ├── wikipedia.ts       # Wikipedia API integration
│       ├── news.ts            # News API integration
│       └── aggregator.ts      # Combines all services
├── build/                     # Compiled JavaScript (generated)
├── .env.example               # Example environment variables
├── .env                       # Your API keys (git-ignored)
├── package.json
├── tsconfig.json
├── claude.md                  # Project context for Claude
└── README.md
```

## 🛠️ Development

### Scripts

- `npm run build` - Compile TypeScript
- `npm run watch` - Watch mode for development
- `npm run start:mcp` - Run MCP server
- `npm run start:http` - Run HTTP server
- `npm run dev:http` - Build and run HTTP server

### Adding New Services

1. Create a new file in `src/services/`
2. Implement the service following the pattern in existing files
3. Add to `aggregator.ts` to include in results
4. Both MCP and HTTP servers will automatically use it!

## 🧪 Testing

### Test MCP Server:
```bash
npm run start:mcp
```
Then use Claude Desktop to query it.

### Test HTTP API:
```bash
npm run start:http

# In another terminal:
curl "http://localhost:3000/api/performances?artist=Coldplay&country=Brazil"
```

## 📝 API Response Format

### Success Response:
```typescript
{
  artist: string;           // "Coldplay"
  location: string;         // "Brazil"
  performed: boolean;       // true
  events: Array<{
    date: string;          // "2023-10-13"
    venue: string;         // "Allianz Parque"
    city: string;          // "São Paulo"
    country: string;       // "Brazil"
    source: string;        // "Songkick"
    sourceUrl: string;     // Full URL to event
    confidence: 'high' | 'medium' | 'low';
  }>;
  sources: Array<{
    title: string;         // Article title
    url: string;           // Article URL
    type: 'official' | 'news' | 'musicdb' | 'social' | 'other';
    publishedDate?: string;
    snippet?: string;
  }>;
  message?: string;        // Optional message
}
```

## ❗ Troubleshooting

### "Missing API keys" warning
- Create `.env` file from `.env.example`
- Add your API keys
- Rebuild: `npm run build`

### MCP server not appearing in Claude
- Use absolute path in `claude_desktop_config.json`
- Path should point to `build/mcp-server.js` (not `build/index.js`)
- Restart Claude Desktop completely

### HTTP server won't start
- Check if port 3000 is already in use
- Change port in `.env`: `PORT=3001`

### No results returned
- Verify API keys are correct
- Check `/api/health` endpoint to see which services are configured
- Some APIs have rate limits

## 🎯 Next Steps

Ready to build a frontend? The HTTP API is ready for:

- [ ] React frontend with search interface
- [ ] Timeline/map visualization of performances
- [ ] Artist comparison features
- [ ] User favorites and watchlists

See `claude.md` for detailed project context and ideas.

## 📄 License

MIT

---

**Built with MCP** - Learn more about Model Context Protocol: https://modelcontextprotocol.io
