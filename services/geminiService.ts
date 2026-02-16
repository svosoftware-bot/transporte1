
import { GoogleGenAI, Type } from "@google/genai";
import { Trip } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFreight = async (tripData: Partial<Trip>) => {
  // Using gemini-3-pro-preview for complex reasoning and analysis tasks
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Analise a viabilidade detalhada deste frete para um caminhoneiro no Brasil:
    Origem: ${tripData.origin}
    Destino: ${tripData.destination}
    Distância estimada: ${tripData.distance} km
    Valor Bruto do Frete: R$ ${tripData.freightValue}
    
    Custos Informados:
    - Comissão do Motorista: R$ ${tripData.driverCommission}
    - Gasto com Combustível: R$ ${tripData.fuelCost}
    - Gasto com Pedágio: R$ ${tripData.tollCost}
    - Outras Despesas: R$ ${tripData.otherExpenses}
    - Adiantamento Recebido: R$ ${tripData.advanceAmount}
    
    Considere preços atuais de mercado e o saldo que sobrará após todos os descontos (Lucro Líquido Real).
    Retorne uma análise em JSON com:
    - score: de 0 a 100 (saúde financeira da viagem)
    - verdict: "Excelente", "Bom", "Risco" ou "Prejuízo"
    - tips: lista de 3 dicas estratégicas para esta rota específica
    - estimatedNetProfit: valor numérico do lucro líquido final (Frete - Comissão - Diesel - Pedágio - Despesas)
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedNetProfit: { type: Type.NUMBER }
          },
          required: ["score", "verdict", "tips", "estimatedNetProfit"]
        }
      }
    });

    // Access .text property directly (do not call as a function)
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return null;
  }
};
