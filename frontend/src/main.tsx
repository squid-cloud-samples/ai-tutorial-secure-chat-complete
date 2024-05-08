import { SquidContextProvider } from '@squidcloud/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

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
      appId: import.meta.env.VITE_SQUID_APP_ID,
      region: import.meta.env.VITE_SQUID_REGION,
      environmentId: import.meta.env.VITE_SQUID_ENVIRONMENT_ID,
      squidDeveloperId: import.meta.env.VITE_SQUID_DEVELOPER_ID,
    }}
  >
      <App />
    </SquidContextProvider>
  </Auth0Provider>,
);
