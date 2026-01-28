import readline from 'readline';

// Single readline interface
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
