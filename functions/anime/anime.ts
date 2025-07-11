import { Handler, HandlerEvent } from '@netlify/functions';

import { bodyParamsType } from './anime.d';
import { animeQuery, getResponseText, searchApi } from './utils';
import AnimeModel from './AnimeModel';
import { CONFIG, getSecurityTokens } from './config';
import {
  validateBodyParams,
  sanitizeSearchTerm,
  parseSlackBody,
  ValidationError,
} from './validation';

const defaultParams: bodyParamsType = {
  text: '',
  response_url: '',
  token: '',
};

const handler: Handler = async (event: HandlerEvent) => {
  const { body, httpMethod } = event;

  // Handle GET requests
  if (httpMethod === CONFIG.HTTP_METHODS.GET) {
    return { statusCode: CONFIG.STATUS_CODES.NOT_FOUND };
  }

  try {
    // Parse and validate request body
    const bodyParams: bodyParamsType = body
      ? parseSlackBody(body)
      : defaultParams;

    validateBodyParams(bodyParams);

    // Validate security token
    const securityTokens = getSecurityTokens();
    if (!securityTokens.includes(bodyParams.token)) {
      return { statusCode: CONFIG.STATUS_CODES.UNAUTHORIZED };
    }

    // Prepare search
    const searchTerm = sanitizeSearchTerm(bodyParams.text);
    const variables = { anime: searchTerm };

    // Call the API
    const response = await searchApi(variables, animeQuery);

    // Handle API errors
    if ('errors' in response) {
      return {
        statusCode: CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR,
        body: `Something went wrong with looking up ${searchTerm}`,
      };
    }

    // Generate response
    const isMarkdown = bodyParams.response_url === 'markdown';
    const anime = new AnimeModel(response.data.Media);
    const responseText = getResponseText(anime, isMarkdown);

    return {
      statusCode: CONFIG.STATUS_CODES.OK,
      headers: {
        'Content-Type': CONFIG.CONTENT_TYPES.JSON,
      },
      body: JSON.stringify({
        text: responseText,
        response_type: CONFIG.RESPONSE_TYPES.IN_CHANNEL,
      }),
    };
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return {
        statusCode: CONFIG.STATUS_CODES.BAD_REQUEST,
        body: JSON.stringify({ message: error.message }),
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Unexpected error:', errorMessage);

    return {
      statusCode: CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export { handler };
