import { Body, Controller, Get, Post } from '@nestjs/common';
import { PineconeService } from './pinecone.service';

@Controller('pinecone')
export class PineconeController {
  constructor(private pineconeService: PineconeService) {}

  @Get('status')
  getStatus(): Promise<string> {
    return this.pineconeService.getStatus();
  }

  @Post('')
  async generateChatResponse(@Body() input: { text: string }): Promise<void> {
    console.log('Received text:', input.text);
    return this.pineconeService.upsertData(input.text);
  }
}
