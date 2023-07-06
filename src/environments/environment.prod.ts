export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8080/dcapi',
  keycloak: {
    issuer: 'https://keycloak.open1.eu',
    realm: 'dc',
    clientId: 'dc-view',
    roleClientId: 'dc-api'
  },
  kcmUrl: 'http://localhost:4201/'
};
