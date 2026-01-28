import { Injectable } from '@nestjs/common';
import { HumanMessage } from '@langchain/core/messages';
import { createHealthCoachGraph } from './agent/health-coach-agent.graph';
import { rl } from './helpers/create-readline';

@Injectable()
export class LangGraphService {
  private app = createHealthCoachGraph();

  constructor() {}

  async ask(message: string): Promise<string> {
    const response = await this.app.invoke(
      { messages: [new HumanMessage(message)] },
      { configurable: { thread_id: 'health-coach' } },
    );

    return response.messages.at(-1)?.content?.toString() ?? '';
  }

  static askQuestion() {
    //   console.log(process.stdin, this.rl);
    return new Promise<string>((resolve) =>
      rl.question('You: ', (ans) => {
        return resolve(ans);
      }),
    );
  }
}
