# Sample showcasing how to secure your Squid AI chatbot

### What it is:

- A Squid backend with a security service function to enable access to a Squid AI profile.
- A React frontend that uses Squid's [React SDK](https://docs.squid.cloud/docs/development-tools/react-sdk/).

### What you'll need:

- A [Squid Cloud](https://console.squid.cloud) account
- Node.js and npm
- [The Squid CLI](https://docs.squid.cloud/docs/development-tools/local-dev-cli)

## Create a Squid project

1. Navigate to the Squid Cloud Console.
2. Click **Create new application**.
3. Name the app "squid-facts".
4. Choose **us-east-1.aws** as the project region.

## Create a chat agent

1. In the Squid Console, ensure you are in the `dev` environment. If you are in the `prod` environment, click the **prod** button at the top of the window and select **dev** from the dropdown.
2. Select the **Agent Studio** tab.
3. Click **Create your first Agent**. Give the agent the ID **squid-facts** with description **Squid Facts chatbot**.
4. Click **Create**. You have now created an AI agent!

An agent can be thought of as one distinct AI chatbot. You can have multiple agents with different purposes. Notice that agents have two components: Instructions and Abilities.

- Instructions are the rule set for how the chatbot profile responds and answers questions. They can be about tone or purpose. For example, "You are a pirate. Only answer questions like a pirate would", or "You are a helpful customer support expert that understands camping products and can answer questions in detail”.
- Abilities consists of a wide breadth of actions the agent can choose to take, including looking in a knowledge base of context.
5. In the **Instructions** box, enter the following text as the instruction:

```
You're a friendly AI who shares random facts about squids and answers user questions about squids.

Use only language that is appropriate for children.

Important: Only answer based on the provided context.
```

## Add the Auth0 integration

1. If you haven't yet made an Auth0 API, set up an [Auth0 account](https://auth0.com/) and create a [single-page application configured to use React](https://auth0.com/docs/quickstart/spa/react) and an audience using an Auth0 [API](https://auth0.com/docs/get-started/apis). Use `'squid-ai'` as the API audience.
   When adding the callback and logout URLs, use `http://localhost:5173`.
2. In the Squid Cloud Console in the `dev` environment, select the **Connectors** tab.
3. Click the **Available connectors** tab to view all connectors.
4. Scroll or search for the Auth0 integration and click **Add Connector**.
5. Enter **auth0** for the Connector ID.
6. Enter the client ID and audience for your Auth0 app. These can be found in the Auth0 console.
7. Click **Add Connector**.

## Get the code

1. Change to the `frontend` directory, and then install the required NPM packages:

```bash
cd frontend
npm install
```

2. Change to the `backend` directory and install the required NPM packages:

```bash
cd ../backend
npm install
```

Open the project in the IDE of your choice.

## Download the environment configuration file

1. In the **Application** tab, scroll to the **Backend Project** section and click **Create .env file**.
2. Copy the command and run it in your terminal in the `backend` folder. This creates a `.env` file that's used in local development.

The command will have the following format:

```sh
squid init-env \
--appId YOUR_APP_ID \
--apiKey YOUR_API_KEY \
--environmentId dev \
--squidDeveloperId YOUR_SQUID_DEVELOPER_KEY \
--region us-east-1.aws
```

## Add Squid Cloud to the frontend

1. Navigate to `frontend/src/main.tsx`. Notice there is an `Auth0Provider` component and a `SquidContextProvider` component, both of which require configuration:

```tsx title='src/main.tsx'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Auth0Provider
    domain="AUTH0_DOMAIN"
    clientId="AUTH0_CLIENT_ID"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'squid-ai',
    }}
  >
    <SquidContextProvider
      options={{
        appId: 'YOUR_APP_ID',
        region: 'us-east-1.aws', // replace with your region
        environmentId: 'dev',
        squidDeveloperId: 'YOUR_SQUID_DEVELOPER_ID',
      }}
    >
      <App />
    </SquidContextProvider>
  </Auth0Provider>
);
```

2. Replace the placeholders in the `Auth0Provider` component with the domain and client ID from your Auth0 application.

3. Replace the placeholders in the SquidContextProvider component with the App ID, Region and Developer ID for your Squid app. You can find these values in the [Squid Console](https://console.squid.cloud).

## Try out the app

1. To run the backend locally, change to the `backend` directory and run:

```bash
squid start
```

2. Open a separate terminal window. Change to the `frontend` directory and run:

```bash
npm run dev
```

You now have two terminal windows: one running the backend and the other running the frontend.

3. To view the app, navigate to localhost:PORT where PORT is logged in the terminal. The address will likely be `http://localhost:5173`.

4. Ask a question about squids to the chatbot. Notice you do not get a response. Instead, an unauthorized message appears.

5. Log into the app and ask a question again. Now the AI chatbot will chat with you!

Feel free to keep asking questions and to see what happens when you log out and in. With the Squid Service on the backend handling authorization, you can rest easy knowing only authenticated users will have access to the service.

Here are some questions to try:

- Do squids have arms or tentacles?
- What should I do if I encounter a squid?
- What's your favorite fact about squids?
- Tell me about the Onykia ingens.

Share your favorite squid questions and answers with the Squid Squad on [Discord](https://discord.gg/Cs8bwVBkKe) or [X](https://twitter.com/_squidcloud).

## Advanced `@secureAiAgent` usage

The `@secureAiAgent`-decorated function can do more than just check if the user has logged into Auth0. The function can take in a [SecureAiAgentContext](https://docs.getsquid.ai/generated-docs/backend/classes/secureaiagentcontext) object and enforce other rules, like so:
```typescript
@secureAiAgent('squid-facts')
allowChat(context: SecureAiAgentContext): boolean {
  // Enforce the user is logged in.
  if (!this.isAuthenticated()) {
    return false;
  }
  
  // Don't allow the user to override the LLM model configured for the agent.
  if (context.options?.model !== undefined) {
    return false;
  }
  
  // Block nefarious prompts in either the prompt itself or the added instructions.
  if (`${context.prompt || ''} ${context.options?.instructions || ''}`.toLowerCase().includes('ignore all previous instructions')) {
    return false;
  }
  return true;
}
```

For a list of all `options` fields that can be analyzed in this function, see [BaseAiChatOptions](https://docs.getsquid.ai/generated-docs/typescript-client/interfaces/baseaichatoptions).

## Conclusion

Congratulations! You just added a chatbot to an app, and then secured it using the Squid Backend SDK. Feel free to keep asking questions to see just how much this AI chatbot knows about squids!

### Clean up

To prevent further billing, delete the Squid app in the Squid Console by selecting the **Overview** tab for the app and scrolling down to **Delete Application**.
