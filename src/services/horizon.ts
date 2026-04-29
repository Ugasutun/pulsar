import { Horizon } from "@stellar/stellar-sdk";

import { config } from "../config.js";
import { PulsarValidationError } from "../errors.js";
import { accessControl } from "./access-control.js";

const NETWORK_HORIZON_URLS: Record<string, string> = {
  mainnet: "https://horizon.stellar.org",
  testnet: "https://horizon-testnet.stellar.org",
  futurenet: "https://horizon-futurenet.stellar.org",
};

export function getHorizonUrl(network?: string): string {
  const net = network ?? config.stellarNetwork;
  if (net === "custom") {
    if (!config.horizonUrl) throw new PulsarValidationError("HORIZON_URL must be set for custom network");
    accessControl.assertAllowed(config.horizonUrl);
    return config.horizonUrl;
  }
  const url = NETWORK_HORIZON_URLS[net] ?? NETWORK_HORIZON_URLS["testnet"];
  accessControl.assertAllowed(url);
  return url;
}

export function getHorizonServer(network?: string): Horizon.Server {
  return new Horizon.Server(getHorizonUrl(network), { allowHttp: true });
}
