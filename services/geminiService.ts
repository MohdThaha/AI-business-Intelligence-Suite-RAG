import { GoogleGenAI, Type } from "@google/genai";
import type { AnalyticsResponse } from '../types';
import { documents } from './mockKnowledgeBase';

// --- Start of RAG implementation ---

// This service simulates a Retrieval-Augmented Generation (RAG) pipeline,
// similar to what one might build with LangChain, Pinecone, and an LLM.

// 1. Knowledge Base (simulating a vector database like Pinecone)
// The `documents` are imported from mockKnowledgeBase.ts, representing our indexed company data.

// 2. Retriever (simulating a LangChain vector store retriever)
// This function finds the most relevant documents for a given query.
// A real-world LangChain implementation would use vector embeddings and similarity search.
// Here, we use a sophisticated keyword scoring mechanism to simulate that process.
const retrieveContext = (query: string, maxResults: number = 3): string => {
  const queryWords = new Set(query.toLowerCase().replace(/[?,.]/g, '').split(/\s+/).filter(word => word.length > 3));
  if (queryWords.size === 0) return '';

  const scoredDocs = documents.map(doc => {
    const contentLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    let score = 0;
    
    queryWords.forEach(word => {
      // Higher score for matches in the title
      if (titleLower.includes(word)) {
        score += 2;
      }
      // Score for matches in the content
      if (contentLower.includes(word)) {
        score += 1;
      }
    });

    // Boost score for more recent documents
    if (doc.metadata.date) {
        const date = new Date(doc.metadata.date);
        const now = new Date();
        const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        if (monthsAgo < 6) {
            score *= 1.2; // 20% boost for docs from the last 6 months
        }
    }

    return { ...doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);

  const topDocs = scoredDocs.filter(doc => doc.score > 1).slice(0, maxResults);
  
  if (topDocs.length === 0) {
    return "No specific context found. Analyze the query based on general business knowledge.";
  }
  
  // Format the context clearly for the LLM
  return topDocs.map(doc => `--- Document: ${doc.title} (${doc.metadata.source}, ${doc.metadata.date}) ---\n${doc.content}`).join('\n\n');
};

// --- End of RAG implementation ---


const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, insightful summary of the data analysis in 2-3 sentences. Explain the key trend or finding.",
    },
    kpis: {
      type: Type.ARRAY,
      description: "A list of 3-4 key performance indicators (KPIs) derived from the query.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "The name of the KPI (e.g., 'Total Revenue')." },
          value: { type: Type.STRING, description: "The main value of the KPI (e.g., '$5.2M')." },
          change: { type: Type.STRING, description: "The change percentage or value (e.g., '+5.2%')." },
          changeType: {
            type: Type.STRING,
            description: "Indicates if the change is an 'increase', 'decrease', or 'neutral'. Use 'increase' for positive changes (more revenue, users) and 'decrease' for negative ones (higher churn, lower conversion).",
            enum: ['increase', 'decrease', 'neutral']
          },
        },
        required: ["label", "value", "change", "changeType"],
      },
    },
    chartData: {
      type: Type.ARRAY,
      description: "An array of data points for visualization. Each point should be an object.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The label for the X-axis (e.g., a month, a category)." },
          value: { type: Type.NUMBER, description: "The numerical value for the Y-axis." },
        },
        required: ["name", "value"],
      },
    },
    chartType: {
      type: Type.STRING,
      description: "The suggested chart type. Can be 'bar', 'line', or 'area'. Choose the most appropriate for the data.",
      enum: ['bar', 'line', 'area'],
    },
    chartKey: {
      type: Type.STRING,
      description: "The key in the chartData objects that corresponds to the numerical value to be plotted. This MUST be 'value'.",
    },
    chartTitle: {
      type: Type.STRING,
      description: "A descriptive title for the chart (e.g., 'Quarterly Sales Performance')."
    }
  },
  required: ["summary", "kpis", "chartData", "chartType", "chartKey", "chartTitle"],
};

const systemInstruction = `
You are a world-class Business Intelligence (BI) analyst AI. Your task is to analyze user queries about business data and provide a structured, insightful response in JSON format.
- You will be given CONTEXT from a set of retrieved internal company documents. You MUST base your analysis primarily on this provided context.
- Synthesize information from MULTIPLE documents if necessary to answer the query comprehensively.
- If the context is high-level, you can generate realistic, more granular data (like monthly breakdowns) that aligns with the context. For example, if context says Q1 revenue was $3M, you can create a monthly breakdown like Jan: $0.9M, Feb: $1.0M, Mar: $1.1M.
- The data you generate should be realistic and contextually relevant to the user's query and the provided context.
- For financial data, use appropriate currency symbols and abbreviations (e.g., '$', 'M' for million).
- The summary must be a high-level insight, not just a description of the data.
- Ensure the 'changeType' for KPIs accurately reflects whether the change is positive or negative for the business.
- The 'chartKey' must always be 'value'.
`;

export const getBusinessInsights = async (query: string): Promise<AnalyticsResponse> => {
  try {
    const context = retrieveContext(query);
    const augmentedQuery = `
CONTEXT:
---
${context}
---

QUERY: "${query}"

Analyze the query based on the provided context and generate a response.
`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: augmentedQuery,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    // It's already an object thanks to the API, but let's parse to be safe and validate.
    const parsedData = JSON.parse(jsonText);

    // Minor data transformation to fit recharts 'dataKey' pattern
    const transformedChartData = parsedData.chartData.map((item: {name: string; value: number}) => ({
        name: item.name,
        [parsedData.chartKey]: item.value,
    }));
    
    return {
        ...parsedData,
        chartData: transformedChartData,
    };

  } catch (error) {
    console.error("Error fetching or parsing Gemini response:", error);
    throw new Error("Failed to communicate with the AI model. Please check your query or API key.");
  }
};