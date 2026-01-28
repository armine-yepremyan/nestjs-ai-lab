export interface AgentPreferences {
  dietType?: string;
  fitnessLevel?: string;
}

export enum Nodes {
  GenerateDiet = 'generate_diet',
  AskForPreferences = 'ask_for_preferences',
}
