import { Module } from '@nestjs/common';
import { LangGraphService } from './langgraph.service';

@Module({
  providers: [LangGraphService],
  exports: [LangGraphService],
})
export class LangGraphModule {}
