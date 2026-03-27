import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceData } from '../types';
import { formatCurrency } from '../lib/utils';

interface ChartProps {
  data: PriceData[];
  symbol: string;
}

export function Chart({ data, symbol }: ChartProps) {
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-[300px] w-full bg-[#0A0A0A] rounded-xl border border-[#1F1F1F] p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{symbol} Price History (15m)</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-gray-600 font-mono uppercase">Live Feed</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]} 
            orientation="right"
            tick={{ fontSize: 10, fill: '#4B5563' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => formatCurrency(val)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', fontSize: '12px' }}
            itemStyle={{ color: '#F97316' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [formatCurrency(value), 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#F97316" 
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            strokeWidth={2}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
