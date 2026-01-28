// import {
//   StateGraph,
//   START,
//   END,
//   MemorySaver,
//   MessagesAnnotation,
// } from '@langchain/langgraph';
// import { callAgentNode } from './health-coach-agent.nodes';

// export function createAgentGraph() {
//   const workflow = new StateGraph(MessagesAnnotation)
//     .addNode('agent', callAgentNode)
//     .addEdge(START, 'agent')
//     .addEdge('agent', END);

//   return workflow.compile({
//     checkpointer: new MemorySaver(),
//   });
// }

import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
  MemorySaver,
} from '@langchain/langgraph';
import {
  askForPreferences,
  generateDiet,
  routeNextNode,
} from './health-coach-agent.nodes';
import { Nodes } from './health-coach-agent.types';

export function createHealthCoachGraph() {
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode(Nodes.AskForPreferences, askForPreferences)
    .addNode(Nodes.GenerateDiet, generateDiet)
    .addConditionalEdges(START, routeNextNode)
    .addConditionalEdges(Nodes.AskForPreferences, routeNextNode)
    .addEdge(Nodes.GenerateDiet, END);

  return workflow.compile({
    checkpointer: new MemorySaver(),
  });
}
