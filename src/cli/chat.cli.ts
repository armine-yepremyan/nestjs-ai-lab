import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AiService } from '../ai/ai.service';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function startCliChat() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const aiService = app.get(AiService);

  const rl = readline.createInterface({ input, output });

  console.log('💬 AI Chat started. Type "exit" to quit.\n');

  while (true) {
    const userInput = await rl.question('You: ');

    const response = await aiService.chat(userInput);
    console.log(`AI: ${response.reply}\n`);

    if (response.ended) {
      rl.close();
      await app.close();
      break;
    }
  }
}

startCliChat();
