// Domains blocked by default on a no-AI day. Subdomains are matched too.
// Every domain added here also needs a host permission in manifest.json.
// Users can add and remove sites from the options.
export const SITES = [
  'chatgpt.com',
  'chat.openai.com',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'perplexity.ai',
  'chat.mistral.ai',
  'chat.deepseek.com',
  'grok.com',
  'poe.com',
];

// 0 = Sunday ... 6 = Saturday, as in Date.getDay().
export const DEFAULT_DAYS = [5];
