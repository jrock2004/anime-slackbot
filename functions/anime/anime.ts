import { Handler, HandlerEvent } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

import type { SlackParams } from './types';
import { animeQuery, getResponseText, searchApi } from './utils';
import AnimeModel from './AnimeModel';

const parseSlackBody = (body: string | null): SlackParams => {
  if (!body) {
    return { text: '', response_url: '', token: '' };
  }

  try {
    const params = new URLSearchParams(body);

    return {
      text: params.get('text') ?? '',
      response_url: params.get('response_url') ?? '',
      token: params.get('token') ?? '',
    };
  } catch {
    return { text: '', response_url: '', token: '' };
  }
};

const handler: Handler = async (event: HandlerEvent) => {
  const { body, httpMethod } = event;

  const bodyParams = parseSlackBody(body);

  const securityTokenEnvVariable: string = process.env.TOKEN || uuidv4();
  const tokens = securityTokenEnvVariable.split(',');
  const searchTerm = decodeURI(bodyParams.text.trim()).replaceAll('%3A', ':');

  if (httpMethod === 'GET') {
    return { statusCode: 404 };
  }

  // Check if params are empty, if so return error
  if (!bodyParams.response_url || !bodyParams.text || !bodyParams.token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    };
  }

  // Check if token matches, if not return unauthorized
  if (!tokens.includes(bodyParams.token)) {
    return { statusCode: 401 };
  }

  // Call the API to get anime info
  const variables = {
    anime: searchTerm,
  };
  const response = await searchApi(variables, animeQuery);

  // Parse the response to to what slack expects
  if ('errors' in response) {
    return {
      statusCode: 500,
      body: `Something went wrong with looking up ${searchTerm}`,
    };
  }

  const isMarkdown = bodyParams.response_url === 'markdown' || false;
  const anime = new AnimeModel(response.data.Media);
  const responseText = getResponseText(anime, isMarkdown);

  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: responseText,
        response_type: 'in_channel',
      }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { statusCode: 500, body: error.message };
    }

    return { statusCode: 500, body: 'An unknown error occurred' };
  }
};

export { handler };
