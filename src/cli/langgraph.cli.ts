import readline from 'readline';
import { LangGraphService } from '../langgraph/langgraph.service';
import { rl } from '../langgraph/helpers/create-readline';
// import { askQuestion } from '../langgraph/agent/health-coach-agent.nodes';

async function interact(langGraphService: LangGraphService) {
  const message = await LangGraphService.askQuestion();
  if (['exit', 'quit'].includes(message.trim().toLowerCase())) {
    console.log('Goodbye! 👋');
    rl.close();
    return;
  }

  const response = await langGraphService.ask(message);
  console.log('Agent:', response);

  await interact(langGraphService);
}

// Create service instance and start CLI
const service = new LangGraphService();
console.log('💬 AI Chat started. Type "exit" to quit.\n');
interact(service);
