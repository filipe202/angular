export const environment = {
  production: true,
  keycloak: {
    enabled: true,
    url: 'https://edockeycloak.capwatt.com',
    realm: 'CAPWATT',
    clientId: 'edoc'
  },
  edoclink: {
    apiUrl: 'https://edoclink.capwatt.com/api',
    iframeUrl: 'https://edoclink.capwatt.com'
  }
};
