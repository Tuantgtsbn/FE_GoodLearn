// NETWORK
const NETWORK_CONFIG = {
  FRONT_END_BASE_URL: import.meta.env.VITE_FRONTEND_BASE_URL,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  TIMEOUT: 30000,
  RETRY: false,
  USE_TOKEN: true,
  WITH_METADATA: false,
  DISPLAY_ERROR: false,
};

// STORE
const STORE_NAME = 'state';

//DEFAULT IMAGE
const DEFAULT_IMAGE = {
  AVATAR: '/images/default-avatar.jpg',
};

export default {
  NETWORK_CONFIG,
  STORE_NAME,
  DEFAULT_IMAGE,
};
