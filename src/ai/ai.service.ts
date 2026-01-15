import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { getEncoding } from 'js-tiktoken';
import type { ChatCompletionMessageParam } from 'openai/resources';

const MAX_TOKENS_IN_HISTORY = 1000;
const DEVELOPER_MESSAGE = 'You are a health coach and fitness trainer.';

@Injectable()
export class AiService {
  private openai: OpenAI;

  private conversationHistory: Array<
    ChatCompletionMessageParam & { tokenCount?: number }
  > = [
    {
      role: 'system',
      content: DEVELOPER_MESSAGE,
      tokenCount: this.countTokens(DEVELOPER_MESSAGE),
    },
  ];

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  private countTokens(text: string): number {
    const encoder = getEncoding('gpt2');
    return encoder.encode(text).length;
  }

  private trimConversationHistory(): void {
    let totalTokens = this.conversationHistory.reduce(
      (sum, msg) => sum + (msg.tokenCount || 0),
      0,
    );

    while (
      totalTokens > MAX_TOKENS_IN_HISTORY &&
      this.conversationHistory.length > 1
    ) {
      const removed = this.conversationHistory[1];
      totalTokens -= removed.tokenCount || 0;
      this.conversationHistory.splice(1, 1);
    }
  }

  async chat(userInput: string): Promise<{ reply: string; ended?: boolean }> {
    const normalized = userInput.trim().toLowerCase();

    if (['exit', 'quit'].includes(normalized)) {
      this.resetConversation();
      return { reply: 'Goodbye! 👋', ended: true };
    }

    if (normalized.includes('image') || normalized.includes('picture')) {
      const result = await this.openai?.images?.generate({
        model: 'dall-e-2',
        prompt: userInput,
        n: 1,
      });
      return { reply: result.data?.[0].url || '' };
    }

    const userTokenCount = this.countTokens(userInput);
    this.conversationHistory.push({
      role: 'user',
      content: userInput,
      tokenCount: userTokenCount,
    });

    this.trimConversationHistory();

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: this.conversationHistory.map(({ tokenCount, ...msg }) => msg),
      max_tokens: 200,
      top_p: 0.9,
    });
    this.openai.images.generate;

    const assistantMessage = response.choices[0].message.content || '';

    this.conversationHistory.push({
      role: 'assistant',
      content: assistantMessage,
      tokenCount: this.countTokens(assistantMessage),
    });

    return { reply: assistantMessage };
  }

  resetConversation(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: DEVELOPER_MESSAGE,
        tokenCount: this.countTokens(DEVELOPER_MESSAGE),
      },
    ];
  }
}
