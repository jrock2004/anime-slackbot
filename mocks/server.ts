import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup server with default handlers for Node.js test environment
export const server = setupServer(...handlers);
