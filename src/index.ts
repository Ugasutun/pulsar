#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { config } from "./config.js";

const server = new Server(
  {
    name: "pulsar",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_account_balance",
      description: "Get the current XLM and issued asset balances for a Stellar account.",
      inputSchema: {
        type: "object",
        properties: {
          account_id: {
            type: "string",
            description: "The Stellar public key (G...)",
          },
        },
        required: ["account_id"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_account_balance") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ message: "Mocked response for get_account_balance", input: args }),
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

server.onerror = (error) => {
  console.error(`[MCP Error] ${error.message}`);
};

const transport = new StdioServerTransport();

async function main() {
  await server.connect(transport);
  console.error(`pulsar MCP server v1.0.0 is running on ${config.stellarNetwork}...`);
}

main().catch((error) => {
  console.error("❌ Fatal error in pulsar server:", error);
  process.exit(1);
});

process.on("SIGINT", () => {
  process.exit(0);
});

process.on("SIGTERM", () => {
  process.exit(0);
});
