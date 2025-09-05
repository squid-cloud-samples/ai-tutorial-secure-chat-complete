import { secureAiAgent, SecureAiAgentContext, SquidService } from '@squidcloud/backend';
/*
  This service allows only authenticated users to chat with the AI assistant.
  For more information on securing your Squid AI assistant, see the documentation:
  https://docs.getsquid.ai/docs/security/security-rules/secure-ai-agents
*/
export class AiSecurityService extends SquidService {
  @secureAiAgent('squid-facts')
  allowChat(context: SecureAiAgentContext): boolean {
    // Enforce the user is logged in.
    if (!this.isAuthenticated()) {
      return false;
    }
    // Don't allow the user to override the LLM model configured for the agent.
    return context.options?.model === undefined;
  }
}
