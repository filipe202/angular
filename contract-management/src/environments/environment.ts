export const environment = {
  production: false,
  keycloak: {
    enabled: false, // Set to true when Keycloak is available
    url: 'https://edockeycloak.capwatt.com',
    realm: 'CAPWATT',
    clientId: 'edoc'
  },
  edoclink: {
    apiUrl: 'https://edoclink.capwatt.com/api',
    iframeUrl: 'https://edoclink.capwatt.com'
  }
};
