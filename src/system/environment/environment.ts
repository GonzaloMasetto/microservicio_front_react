export const environment = {
  authServerUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3000/v1/",
  cartServerUrl: process.env.CART_SERVICE_URL || "http://localhost:3003/v1/",
  catalogServerUrl: process.env.CATALOG_SERVICE_URL || "http://localhost:3002/v1/",
  imageServerUrl: process.env.IMAGE_SERVICE_URL || "http://localhost:3001/v1/",
  orderServerUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3004/v1/",
  production: false,
};
