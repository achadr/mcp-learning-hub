#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { aggregatePerformanceData } from './services/aggregator.js';
import { validateConfig } from './config.js';

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: "mcp-musician-lookup",
    version: "2.0.0",
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
          "Searches Songkick, Ticketmaster, Wikipedia, and news sources for performance data. " +
          "Returns performance dates, venues, and article links.",
        inputSchema: {
          type: "object",
          properties: {
            musician: {
              type: "string",
              description: "The name of the musician or band",
            },
            location: {
              type: "string",
              description: "The country to search for performances (e.g., 'USA', 'France', 'UK')",
            },
          },
          required: ["musician"],
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
    const musician = String(request.params.arguments?.musician || '');
    const location = String(request.params.arguments?.location || '');

    if (!musician) {
      throw new Error("Musician name is required");
    }

    console.error(`[MCP Server] Looking up: ${musician}${location ? ` in ${location}` : ''}`);

    // Check configuration
    const configCheck = validateConfig();
    if (!configCheck.valid) {
      console.error(`[MCP Server] Warning: Missing API keys: ${configCheck.missing.join(', ')}`);
      console.error(`[MCP Server] Some services may not work. Check your .env file.`);
    }

    // Use aggregator to fetch real data
    const result = await aggregatePerformanceData({
      artist: musician,
      country: location || undefined,
    });

    // Format response for Claude
    let responseText = '';

    if (result.performed) {
      responseText += `✅ **Yes, ${result.artist} has performed in ${result.location}**\n\n`;
      responseText += `Found ${result.events.length} performance(s):\n\n`;

      // Show top 5 events
      result.events.slice(0, 5).forEach((event, idx) => {
        responseText += `${idx + 1}. **${event.date}** - ${event.venue}, ${event.city}, ${event.country}\n`;
        responseText += `   Source: ${event.source} - ${event.sourceUrl}\n\n`;
      });

      if (result.events.length > 5) {
        responseText += `... and ${result.events.length - 5} more events\n\n`;
      }

      if (result.sources.length > 0) {
        responseText += `**Additional sources:**\n`;
        result.sources.slice(0, 3).forEach((source, idx) => {
          responseText += `${idx + 1}. [${source.title}](${source.url})`;
          if (source.publishedDate) {
            responseText += ` (${source.publishedDate})`;
          }
          responseText += '\n';
        });
      }
    } else {
      responseText += `❌ **No performance records found**\n\n`;
      responseText += result.message || `Could not find performances for ${result.artist}${result.location !== 'worldwide' ? ` in ${result.location}` : ''}.`;
    }

    return {
      content: [
        {
          type: "text",
          text: responseText,
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
  console.error("🎵 MCP Musician Lookup Server v2.0 running on stdio");
  console.error("📡 Integrated with: Songkick, Ticketmaster, Wikipedia, News API");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
