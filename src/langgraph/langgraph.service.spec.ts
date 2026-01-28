import { Test, TestingModule } from '@nestjs/testing';
import { LangGraphService } from './langgraph.service';

describe('LanggraphService', () => {
  let service: LangGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangGraphService],
    }).compile();

    service = module.get<LangGraphService>(LangGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
