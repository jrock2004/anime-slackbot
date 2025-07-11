import { bodyParamsType } from './anime.d';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateBodyParams = (params: bodyParamsType): void => {
  const errors: string[] = [];

  if (!params.response_url?.trim()) {
    errors.push('response_url is required');
  }

  if (!params.text?.trim()) {
    errors.push('text (search term) is required');
  }

  if (!params.token?.trim()) {
    errors.push('token is required');
  }

  if (errors.length > 0) {
    throw new ValidationError(`Invalid parameters: ${errors.join(', ')}`);
  }
};

export const sanitizeSearchTerm = (text: string): string => {
  return decodeURI(text.trim()).replaceAll('%3A', ':');
};

export const parseSlackBody = (body: string): bodyParamsType => {
  try {
    return JSON.parse(
      `{"${body.replace(/&/g, '", "').replace(/=/g, '": "')}"}`
    );
  } catch {
    throw new ValidationError('Invalid request body format');
  }
};
