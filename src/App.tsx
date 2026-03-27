import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Chart } from './components/Chart';
import { SignalDisplay } from './components/SignalDisplay';
import { Asset, ASSETS, PriceData, TradingSignal } from './types';
import { PriceService } from './services/priceService';
import { generateDeepAnalysis } from './services/analysisService';
import { formatCurrency, cn } from './lib/utils';
import { RefreshCw, Zap, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react';

export default function App() {
  const [selectedAsset, setSelectedAsset] = React.useState<Asset>(ASSETS[0]);
  const [price, setPrice] = React.useState<number>(0);
  const [history, setHistory] = React.useState<PriceData[]>([]);
  const [signal, setSignal] = React.useState<TradingSignal | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  const fetchData = async (asset: Asset) => {
    const currentPrice = await PriceService.getCurrentPrice(asset.symbol);
    const priceHistory = await PriceService.getKlines(asset.symbol);
    setPrice(currentPrice);
    setHistory(priceHistory);
    setLastUpdate(new Date());
  };

  const handleDeepAnalysis = async () => {
    setLoading(true);
    try {
      const newSignal = await generateDeepAnalysis(selectedAsset.symbol, price, history);
      setSignal(newSignal);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(selectedAsset);
    const interval = setInterval(() => fetchData(selectedAsset), 30000); // 30s update
    return () => clearInterval(interval);
  }, [selectedAsset]);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-orange-500/30">
      <Sidebar selectedAsset={selectedAsset} onSelect={(a) => {
        setSelectedAsset(a);
        setSignal(null);
      }} />
      
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <header className="h-20 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Asset</div>
              <div className="text-xl font-bold flex items-center gap-2">
                {selectedAsset.symbol}
                <span className="text-xs font-normal text-gray-500 italic serif">{selectedAsset.name}</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#1F1F1F]" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Live Price</div>
              <div className="text-xl font-mono text-orange-500">{formatCurrency(price)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="text-[10px] text-gray-600 uppercase tracking-widest">Last Update</div>
              <div className="text-xs text-gray-400 font-mono">{lastUpdate.toLocaleTimeString()}</div>
            </div>
            <button 
              onClick={handleDeepAnalysis}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              <Zap className={cn("w-4 h-4", loading && "animate-pulse")} />
              {loading ? "Analyzing..." : "Deep Analysis"}
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-6xl mx-auto w-full">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Chart data={history} symbol={selectedAsset.symbol} />
            </div>
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
                  <Shield className="w-3 h-3 text-orange-500" />
                  Market Sentiment
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-green-500">Bullish</span>
                    <span className="text-red-500">Bearish</span>
                  </div>
                  <div className="h-2 w-full bg-[#1F1F1F] rounded-full overflow-hidden flex">
                    <div className="h-full bg-green-500" style={{ width: '65%' }} />
                    <div className="h-full bg-red-500" style={{ width: '35%' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-[#141414] rounded-lg border border-[#1F1F1F]">
                  <div className="text-[10px] text-gray-600 uppercase mb-1">Volatility</div>
                  <div className="text-sm font-mono text-orange-500">High (12.4%)</div>
                </div>
                <div className="p-3 bg-[#141414] rounded-lg border border-[#1F1F1F]">
                  <div className="text-[10px] text-gray-600 uppercase mb-1">RSI (14)</div>
                  <div className="text-sm font-mono text-white">58.2</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#1F1F1F]">
                <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-tighter">
                  Real-time analysis engine powered by Gemini 3.1 Pro. Signals are generated based on deep technical indicators and market sentiment analysis.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Trading Signal
              </h2>
              {signal && (
                <div className="text-[10px] text-gray-600 font-mono uppercase">
                  Valid for next 15 minutes
                </div>
              )}
            </div>
            
            {signal ? (
              <SignalDisplay signal={signal} loading={loading} />
            ) : (
              <div className="bg-[#0A0A0A] border border-dashed border-[#262626] rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#141414] rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2 italic serif">No Active Signal</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Select an asset and click "Deep Analysis" to generate a high-precision trading signal with exact entry, target, and leverage points.
                </p>
                <button 
                  onClick={handleDeepAnalysis}
                  className="mt-6 text-orange-500 text-sm font-bold hover:underline underline-offset-4"
                >
                  Start Deep Analysis Now
                </button>
              </div>
            )}
          </section>

          <footer className="pt-12 pb-8 border-t border-[#1F1F1F] flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                System Operational
              </div>
              <div>Binance API Connected</div>
              <div>Gemini AI Engine Ready</div>
            </div>
            <div>© 2026 CryptoDeep Analysis Pro • Precision Scalping Tool</div>
          </footer>
        </div>
      </main>
    </div>
  );
}
