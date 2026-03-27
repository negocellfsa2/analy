import React from 'react';
import { TradingSignal } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { TrendingUp, TrendingDown, AlertCircle, Clock, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface SignalDisplayProps {
  signal: TradingSignal | null;
  loading: boolean;
}

export function SignalDisplay({ signal, loading }: SignalDisplayProps) {
  if (loading) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-mono text-sm animate-pulse">Running Deep Analysis Engine...</p>
      </div>
    );
  }

  if (!signal) return null;

  const isBuy = signal.type === 'BUY';
  const isSell = signal.type === 'SELL';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-2xl"
    >
      <div className={cn(
        "px-6 py-4 flex items-center justify-between border-b border-[#262626]",
        isBuy ? "bg-green-500/10" : isSell ? "bg-red-500/10" : "bg-gray-500/10"
      )}>
        <div className="flex items-center gap-3">
          {isBuy ? <TrendingUp className="text-green-500 w-6 h-6" /> : isSell ? <TrendingDown className="text-red-500 w-6 h-6" /> : <AlertCircle className="text-gray-500 w-6 h-6" />}
          <span className={cn(
            "text-lg font-bold tracking-tighter uppercase",
            isBuy ? "text-green-500" : isSell ? "text-red-500" : "text-gray-500"
          )}>
            {signal.type} SIGNAL DETECTED
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Clock className="w-3 h-3" />
          {new Date(signal.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#1F1F1F]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Entry Point</div>
              <div className="text-xl font-mono text-white">{formatCurrency(signal.entryPrice)}</div>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#1F1F1F]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Target (TP)</div>
              <div className="text-xl font-mono text-green-500">{formatCurrency(signal.targetPrice)}</div>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#1F1F1F]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Stop Loss</div>
              <div className="text-xl font-mono text-red-500">{formatCurrency(signal.stopLoss)}</div>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#1F1F1F]">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Confidence</div>
              <div className="text-xl font-mono text-orange-500">{(signal.confidence * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] p-6 rounded-lg border border-[#1F1F1F] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap className="w-12 h-12 text-orange-500" />
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Leverage & Margin</div>
            <div className="flex items-end gap-6">
              <div>
                <div className="text-3xl font-bold text-white">{signal.leverage}x</div>
                <div className="text-[10px] text-gray-600 uppercase">Leverage</div>
              </div>
              <div className="h-10 w-px bg-[#1F1F1F]" />
              <div>
                <div className="text-3xl font-bold text-white">{signal.margin}%</div>
                <div className="text-[10px] text-gray-600 uppercase">Margin</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 bg-[#0A0A0A] p-6 rounded-lg border border-[#1F1F1F]">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Deep Analysis Reasoning</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed italic serif">
              {signal.reasoning}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
            <div className="text-[10px] text-orange-500/70 uppercase tracking-widest mb-1">Execution Window</div>
            <div className="text-sm text-orange-500 font-medium">5 - 15 Minutes (Scalping)</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
