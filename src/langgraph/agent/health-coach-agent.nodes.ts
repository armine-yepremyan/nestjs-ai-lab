import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';
import { AgentState } from './health-coach-agent.state.js';
import { AgentPreferences, Nodes } from './health-coach-agent.types';
import { AIMessage, HumanMessage } from 'langchain';
import { MessagesAnnotation } from '@langchain/langgraph';
import { LangGraphService } from '../langgraph.service';

const SYSTEM_MESSAGE =
  'You are a friendly and knowledgeable healthy lifestyle coach. ' +
  'You help users improve their overall health through balanced diet, physical activity, and sustainable habits.';

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0.5,
});

export const extractPreferences = async (
  message: string,
): Promise<AgentPreferences> => {
  try {
    const result = await model.invoke([
      ['system', SYSTEM_MESSAGE],
      new HumanMessage(
        `Extract "diet type" and "fitness level" from this message. 
        Return plain JSON only: { "dietType": string | null, "fitnessLevel": string | null }  
        Message: ${message}`,
      ),
    ]);

    return JSON.parse(result.content.toString());
  } catch {
    return {};
  }
};

export const askForPreferences = async ({
  messages,
}: typeof MessagesAnnotation.State) => {
  const followup = new AIMessage(
    'To guide you toward a healthier lifestyle, I need a bit more info.\n' +
      'Do you follow any specific diet (e.g., vegetarian, keto)?\n' +
      'And how would you describe your fitness level (beginner, intermediate, advanced)?',
  );

  console.log('* Agent:', followup.content);
  const userResponse = await LangGraphService.askQuestion();

  return {
    messages: [...messages, followup, new HumanMessage(userResponse)],
  };

  return {
    messages: [...messages, followup],
  };
};

// Node: call the AI model
export async function callAgentNode(state): Promise<AgentState> {
  // Build prompt including conversation history
  const prompt = [
    'system',
    'You are a helpful AI healthy lifestyle (fitnes) assistant. Your goal is to provide a user with a simple healthy lifestyle plan which does not require any additional input.',
    ...state.messages.map((msg) => msg.content),
  ];

  const result = await model.invoke(prompt);

  return {
    messages: [result],
  };
}

export const generateDiet = async ({
  messages,
}: typeof MessagesAnnotation.State) => {
  const lastUserMessage =
    messages.findLast((m) => m instanceof HumanMessage)?.content.toString() ??
    '';

  const prefs = await extractPreferences(lastUserMessage);

  const prompt = new HumanMessage(
    `Create a healthy lifestyle-friendly diet plan.
Diet type: ${prefs.dietType}
Fitness level: ${prefs.fitnessLevel}

Focus on sustainability, balance, and practical meals.`,
  );

  const result = await model.invoke([['system', SYSTEM_MESSAGE], prompt]);

  return {
    messages: [...messages, result],
  };
};

export const routeNextNode = async ({
  messages,
}: typeof MessagesAnnotation.State) => {
  const lastUserMessage =
    messages.findLast((m) => m instanceof HumanMessage)?.content.toString() ??
    '';

  const prefs = await extractPreferences(lastUserMessage);

  return prefs.dietType && prefs.fitnessLevel
    ? Nodes.GenerateDiet
    : Nodes.AskForPreferences;
};
