import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { STOCK_ANALYSIS_PROMPT,DAILY_STOCK_ANALYSIS_PROMPT } from '../config/prompt.config';

@Injectable()
export class PromptService {
  generateStockAnalysisPrompt(stockName: string): any {
    return {
      ...STOCK_ANALYSIS_PROMPT,
      input: STOCK_ANALYSIS_PROMPT.input.map(input => ({
        ...input,
        content: input.content.replace('${stockName}', stockName)
      }))
    };
  }

  async getOpenAIResponse(prompt: any): Promise<any> {
    try {
      const result = await axios.post('https://api.openai.com/v1/responses', prompt, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return result.data;
    } catch (error) {
      console.error('OpenAI API call failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async analyzeStock(stockName: string): Promise<any> {
    const prompt = await this.generateStockAnalysisPrompt(stockName);
    return await this.getOpenAIResponse(prompt);
  }
  async dailyStockAnalysis(): Promise<any> {
    // const prompt = await this.generateStockAnalysisPrompt(stockName);
    return await this.getOpenAIResponse(DAILY_STOCK_ANALYSIS_PROMPT);
  }
}