#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Interface for musician performance data
 */
interface PerformanceResult {
  musician: string;
  location: string;
  hasPerformed: boolean;
  performances?: Array<{
    date: string;
    venue: string;
    articleLinks: string[];
  }>;
  message?: string;
}

/**
 * Simulated function to look up musician performances
 * In a real implementation, this would call an external API like:
 * - Setlist.fm API
 * - Songkick API
 * - MusicBrainz API
 * - Or scrape concert databases
 */
async function lookupMusicianPerformance(
  musician: string,
  location: string
): Promise<PerformanceResult> {
  // This is a demo implementation with mock data
  // In production, you'd integrate with real APIs

  console.error(`[MCP Server] Looking up: ${musician} in ${location}`);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data for demonstration
  const mockDatabase: Record<string, Record<string, any>> = {
    "taylor swift": {
      "usa": {
        hasPerformed: true,
        performances: [
          {
            date: "2023-03-17",
            venue: "State Farm Stadium, Glendale, AZ",
            articleLinks: [
              "https://www.example.com/taylor-swift-eras-tour-arizona",
              "https://www.example.com/review-taylor-swift-glendale"
            ]
          },
          {
            date: "2023-08-03",
            venue: "SoFi Stadium, Los Angeles, CA",
            articleLinks: [
              "https://www.example.com/taylor-swift-la-concert"
            ]
          }
        ]
      },
      "france": {
        hasPerformed: true,
        performances: [
          {
            date: "2024-05-09",
            venue: "Paris La Défense Arena, Paris",
            articleLinks: [
              "https://www.example.com/taylor-swift-paris-2024"
            ]
          }
        ]
      }
    },
    "the beatles": {
      "uk": {
        hasPerformed: true,
        performances: [
          {
            date: "1963-08-03",
            venue: "Cavern Club, Liverpool",
            articleLinks: [
              "https://www.example.com/beatles-cavern-club-history"
            ]
          }
        ]
      },
      "usa": {
        hasPerformed: true,
        performances: [
          {
            date: "1964-02-11",
            venue: "The Ed Sullivan Theater, New York",
            articleLinks: [
              "https://www.example.com/beatles-ed-sullivan-show"
            ]
          }
        ]
      }
    }
  };

  const normalizedMusician = musician.toLowerCase().trim();
  const normalizedLocation = location.toLowerCase().trim();

  if (mockDatabase[normalizedMusician]?.[normalizedLocation]) {
    return {
      musician,
      location,
      hasPerformed: true,
      performances: mockDatabase[normalizedMusician][normalizedLocation].performances
    };
  }

  return {
    musician,
    location,
    hasPerformed: false,
    message: `No performance records found for ${musician} in ${location}. Note: This is a demo with limited data. In production, this would query real concert APIs.`
  };
}

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: "mcp-musician-lookup",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "lookup_musician_performance",
        description:
          "Look up whether a musician has performed in a specific country or location. " +
          "Returns performance dates, venues, and article links if found.",
        inputSchema: {
          type: "object",
          properties: {
            musician: {
              type: "string",
              description: "The name of the musician or band",
            },
            location: {
              type: "string",
              description: "The country or location to search for performances",
            },
          },
          required: ["musician", "location"],
        },
      },
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "lookup_musician_performance") {
    const musician = String(request.params.arguments?.musician);
    const location = String(request.params.arguments?.location);

    if (!musician || !location) {
      throw new Error("Both musician and location are required");
    }

    const result = await lookupMusicianPerformance(musician, location);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Musician Lookup Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
