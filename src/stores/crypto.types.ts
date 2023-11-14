export type TCryptoDefaultStates= {
  cryptoList: TCryptoList,
  currenciesList: string[],
  currencyActive: string,
  cryptoFavorites: TCryptoList,
  itemsByPage: number,
}

export type TCryptoList = Record<string, TCryptoData>;

export type TEntryCryptoData = {
  id: string,
  image: string,
  current_price: number
  market_cap: number,
  total_volume: number,
  price_change_24h: number,
  sparkline_in_7d: {
    price: number[],
  }
}

export type TCryptoData = {
  id: string
  name: string
  symbol: string
  image?: string
  category?: string,
  sparkline_in_7d?: number[]
  pricesByCurrencies: {
    [key: string]: {
      current_price: number
      market_cap: number,
      total_volume: number,
      price_change_24h: number,
    }
  }
}

export type TMarketParams = {
  ids: string,
  vs_currency: string,
  per_page: number,
  include_24h_vol: boolean,
  include_24hr_change: boolean,
  include_last_updated_at: boolean,
  sparkline: boolean,
}

export type TCryptoItem = Omit<TCryptoData, 'pricesByCurrencies'>;
