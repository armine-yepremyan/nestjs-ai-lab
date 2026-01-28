import { MessageStructure, MessageToolSet } from '@langchain/core/messages';
import { AIMessageChunk } from 'langchain';

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AgentState {
  messages: AIMessageChunk<MessageStructure<MessageToolSet>>[];
}
