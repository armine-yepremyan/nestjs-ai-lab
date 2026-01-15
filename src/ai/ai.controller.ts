import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async generateChatResponse(
    @Body() input: { prompt: string; instruction?: string },
  ): Promise<{ reply: string; ended?: boolean }> {
    console.log('Received prompt:', input.prompt);
    return this.aiService.chat(input.prompt);
  }
}
