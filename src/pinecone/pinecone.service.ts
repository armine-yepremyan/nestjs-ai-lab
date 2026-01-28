import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

@Injectable()
export class PineconeService {
  private openai: OpenAI;
  private pineconeIndex: Index<RecordMetadata>;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.pineconeIndex = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY') || '',
    }).Index(this.configService.get<string>('PINECONE_INDEX') || '');
  }

  async getStatus(): Promise<string> {
    const pinecone = new Pinecone();

    // Check if the index is accessible
    try {
      const status = await this.pineconeIndex.describeIndexStats();
      return status.namespaces
        ? 'Pinecone index is accessible.'
        : 'Pinecone index is not accessible.';
    } catch (error) {
      console.error('Error accessing Pinecone index:', error);
      if (error.name === 'PineconeNotFoundError') {
        return 'Pinecone index not found.';
      }
      return 'Error accessing Pinecone index.';
    }
  }

  async generateVector(clientInfo: string): Promise<number[]> {
    const vector = await this.openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: [clientInfo],
      dimensions: 1024,
    });
    console.log('Embedding response:', vector.data[0].embedding);
    return vector.data[0].embedding;
  }

  async upsertData(clientInfo: string): Promise<void> {
    const vector = await this.generateVector(clientInfo);
    await this.pineconeIndex.upsert([
      { id: 'client_info', values: vector, metadata: { text: clientInfo } },
    ]);
    console.log('Data upserted successfully for client info:', clientInfo);
  }
}
