import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { PineconeModule } from './pinecone/pinecone.module';
import { LangGraphModule } from './langgraph/langgraph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiModule,
    PineconeModule,
    LangGraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
