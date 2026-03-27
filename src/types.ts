export interface Asset {
  symbol: string;
  name: string;
}

export interface PriceData {
  time: number;
  price: number;
}

export type SignalType = 'BUY' | 'SELL' | 'NEUTRAL';

export interface TradingSignal {
  symbol: string;
  type: SignalType;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  leverage: number;
  margin: number;
  confidence: number;
  timestamp: number;
  reasoning: string;
}

export const ASSETS: Asset[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'NXLYUSDT', name: 'NXLY' },
  { symbol: 'HMYRUSDT', name: 'HMYR' },
  { symbol: 'TRVLYUSDT', name: 'TRVLY' },
  { symbol: 'SHLXUSDT', name: 'SHLX' },
  { symbol: 'GKGPUSDT', name: 'GKGP' },
  { symbol: 'TATLUSDT', name: 'TATL' },
  { symbol: 'LSLAUSDT', name: 'LSLA' },
  { symbol: 'BRBDUSDT', name: 'BRBD' },
  { symbol: 'XYXRUSDT', name: 'XYXR' },
  { symbol: 'OPUSDT', name: 'Optimism' },
  { symbol: 'RENDERUSDT', name: 'Render' },
  { symbol: 'SUIUSDT', name: 'Sui' },
  { symbol: 'TONUSDT', name: 'Toncoin' },
  { symbol: 'WIFUSDT', name: 'dogwifhat' },
  { symbol: 'XRPUSDT', name: 'XRP' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'APTUSDT', name: 'Aptos' },
  { symbol: 'ARBUSDT', name: 'Arbitrum' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'FETUSDT', name: 'Fetch.ai' },
  { symbol: 'ICPUSDT', name: 'Internet Computer' },
  { symbol: 'INJUSDT', name: 'Injective' },
  { symbol: 'NEARUSDT', name: 'Near Protocol' },
  { symbol: 'TIAUSDT', name: 'Celestia' },
  { symbol: 'SEIUSDT', name: 'Sei' },
  { symbol: 'STXUSDT', name: 'Stacks' },
  { symbol: 'LDOUSDT', name: 'Lido DAO' },
  { symbol: 'FILUSDT', name: 'Filecoin' },
];
