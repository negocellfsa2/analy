import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal, PriceData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDeepAnalysis(
  symbol: string,
  currentPrice: number,
  history: PriceData[]
): Promise<TradingSignal> {
  const prompt = `
    Analyze the following cryptocurrency asset for a short-term (5-15 min) high-leverage trading signal.
    Asset: ${symbol}
    Current Price: ${currentPrice}
    Recent Price History (last 50 intervals): ${JSON.stringify(history.map(h => h.price))}

    Objective: Identify the best trading signal (BUY, SELL, or NEUTRAL).
    Requirements:
    - Entry Point: Exact price.
    - Target (Take Profit): Target price to reach within 15 mins.
    - Stop Loss: Price to close if trade goes wrong.
    - Leverage: Between 50x and 200x.
    - Margin: Between 10% and 150%.
    - Reasoning: Deep technical analysis reasoning.
    - Confidence: 0 to 1.

    Return the analysis in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["BUY", "SELL", "NEUTRAL"] },
            entryPrice: { type: Type.NUMBER },
            targetPrice: { type: Type.NUMBER },
            stopLoss: { type: Type.NUMBER },
            leverage: { type: Type.NUMBER },
            margin: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
          },
          required: ["type", "entryPrice", "targetPrice", "stopLoss", "leverage", "margin", "confidence", "reasoning"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      ...result,
      symbol,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    // Fallback signal if AI fails
    return {
      symbol,
      type: 'NEUTRAL',
      entryPrice: currentPrice,
      targetPrice: currentPrice * 1.01,
      stopLoss: currentPrice * 0.99,
      leverage: 50,
      margin: 10,
      confidence: 0.5,
      timestamp: Date.now(),
      reasoning: "Analysis currently unavailable. Technical indicators are inconclusive.",
    };
  }
}
