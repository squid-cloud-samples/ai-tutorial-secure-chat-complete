import { secureAiAgent, SecureAiAgentContext, SquidService } from '@squidcloud/backend';
/*
  This service allows only authenticated users to chat with the AI assistant.
  For more information on securing your Squid AI assistant, see the documentation:
  https://docs.getsquid.ai/docs/security/security-rules/secure-ai-agents
*/
export class AiSecurityService extends SquidService {
  @secureAiAgent('squid-facts')
  allowChat(context: SecureAiAgentContext): boolean {
    if (context.options?.model !== undefined) {
      // Can enforce that the client is not requesting a different LLM model
      // than the one the agent was configured to use.
      return false;
    }
    // Enforce the user is logged in.
    return this.isAuthenticated();
  }
}
