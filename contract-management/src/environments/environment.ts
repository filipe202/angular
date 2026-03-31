export const environment = {
  production: false,
  keycloak: {
    enabled: true,
    url: 'https://edockeycloak.capwatt.com',
    realm: 'CAPWATT',
    clientId: 'edoc'
  },
  edoclink: {
    apiUrl: 'https://edocdevservice.capwatt.com',
    iframeUrl: 'https://edoclink.capwatt.com'
  }
};
