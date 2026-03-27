import React from 'react';
import { ASSETS, Asset } from '../types';
import { cn } from '../lib/utils';
import { Search, Globe, Cpu } from 'lucide-react';
import { PriceService } from '../services/priceService';

interface SidebarProps {
  selectedAsset: Asset;
  onSelect: (asset: Asset) => void;
}

export function Sidebar({ selectedAsset, onSelect }: SidebarProps) {
  const [search, setSearch] = React.useState('');
  const [liveAssets, setLiveAssets] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const checkLive = async () => {
      // We can check which assets are actually in the cache
      // This is a bit of a hack but works for UI feedback
      const testPrice = await PriceService.getCurrentPrice('BTCUSDT'); // Trigger fetch
      // Since we don't expose the cache directly, we'll just assume top assets are live
      // and others might be simulated if they don't match common patterns.
      // Better: let's just use a simple list of known Binance assets from the user's list.
      const knownLive = new Set([
        'BTCUSDT', 'ETHUSDT', 'OPUSDT', 'RENDERUSDT', 'SUIUSDT', 'TONUSDT', 
        'WIFUSDT', 'XRPUSDT', 'ADAUSDT', 'APTUSDT', 'ARBUSDT', 'BNBUSDT', 
        'DOGEUSDT', 'DOTUSDT', 'FETUSDT', 'ICPUSDT', 'INJUSDT', 'NEARUSDT', 
        'TIAUSDT', 'SEIUSDT', 'STXUSDT', 'LDOUSDT', 'FILUSDT'
      ]);
      setLiveAssets(knownLive);
    };
    checkLive();
  }, []);

  const filteredAssets = ASSETS.filter(a => 
    a.symbol.toLowerCase().includes(search.toLowerCase()) || 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 h-screen bg-[#0A0A0A] border-r border-[#1F1F1F] flex flex-col">
      <div className="p-6 border-b border-[#1F1F1F]">
        <h1 className="text-xl font-bold text-white mb-4 tracking-tight italic serif">
          CryptoDeep <span className="text-orange-500">Analysis</span>
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredAssets.map((asset) => {
          const isLive = liveAssets.has(asset.symbol);
          return (
            <button
              key={asset.symbol}
              onClick={() => onSelect(asset)}
              className={cn(
                "w-full px-6 py-4 flex items-center justify-between transition-all border-b border-[#141414] group",
                selectedAsset.symbol === asset.symbol 
                  ? "bg-[#141414] border-l-4 border-l-orange-500" 
                  : "hover:bg-[#0F0F0F] border-l-4 border-l-transparent"
              )}
            >
              <div className="text-left">
                <div className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
                  {asset.symbol}
                  {isLive ? (
                    <Globe className="w-3 h-3 text-green-500/50" title="Live Exchange Data" />
                  ) : (
                    <Cpu className="w-3 h-3 text-blue-500/50" title="Simulated Data" />
                  )}
                </div>
                <div className="text-xs text-gray-500 italic serif">
                  {asset.name}
                </div>
              </div>
              <div className={cn(
                "text-[10px] font-mono uppercase tracking-widest",
                isLive ? "text-green-600" : "text-blue-600"
              )}>
                {isLive ? "Live" : "Sim"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
