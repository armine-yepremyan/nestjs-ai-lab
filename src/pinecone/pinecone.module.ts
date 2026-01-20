import { Module } from '@nestjs/common';
import { PineconeService } from './pinecone.service';
import { PineconeController } from './pinecone.controller';

@Module({
  providers: [PineconeService],
  controllers: [PineconeController]
})
export class PineconeModule {}
