import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '1e696fc9-03fd-4b58-b9b2-0825765c7df9',
    authority: 'https://login.microsoftonline.com/7c59e8c6-8426-4451-ab2b-e11f06472409/v2.0',
    knownAuthorities: ['login.microsoftonline.com'],
    redirectUri: 'http://localhost:4200/home',
    protocolMode: 'AAD'
  },
  cache: {
    cacheLocation: 'localStorage'
  }
};
