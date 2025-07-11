export const CONFIG = {
  ANILIST_API_URL: 'https://graphql.anilist.co',
  DEFAULT_SECURITY_TOKEN: 'dev-token-placeholder',
  HTTP_METHODS: {
    GET: 'GET',
    POST: 'POST',
  },
  STATUS_CODES: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  RESPONSE_TYPES: {
    IN_CHANNEL: 'in_channel',
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
  },
} as const;

export const getSecurityTokens = (): string[] => {
  const tokenEnv = process.env.TOKEN;
  if (!tokenEnv) {
    console.warn('TOKEN environment variable not set, using default');
    return [CONFIG.DEFAULT_SECURITY_TOKEN];
  }
  return tokenEnv.split(',').map((token) => token.trim());
};
