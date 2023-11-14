import type {
  TMarketParams,
} from "@/stores/crypto.types";

export type TCurrencies = Promise<string[]>;

export type TCoins = () => Promise<TCryptoList>;

export type TMarkets = (params: Partial<TMarketParams>) => Promise<TEntryCryptoData[]>;
