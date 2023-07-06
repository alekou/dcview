export const environment = {
  production: true,
  apiBaseUrl: 'https://dc-staging.open1.eu/dcapi',
  keycloak: {
    issuer: 'https://keycloak.open1.eu',
    realm: 'dc-staging',
    clientId: 'dc-view',
    roleClientId: 'dc-api'
  },
  kcmUrl: 'https://kcm-staging.open1.eu'
};
