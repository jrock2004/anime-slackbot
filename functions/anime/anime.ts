import { Handler, HandlerEvent } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';

import { bodyParamsType } from './anime.d';
import { animeQuery, getResponseText, searchApi } from './utils';
import AnimeModel from './AnimeModel';

const defaultParams: bodyParamsType = {
  text: '',
  response_url: '',
  token: '',
};

const handler: Handler = async (event: HandlerEvent) => {
  const { body, httpMethod } = event;
  const bodyParams: bodyParamsType = body ? JSON.parse(body) : defaultParams;

  const securityToken: string = process.env.TOKEN || uuidv4();

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
  if (securityToken !== bodyParams.token) {
    return { statusCode: 401 };
  }

  // Call the API to get anime info
  const variables = {
    anime: bodyParams.text,
  };

  const response = await searchApi(variables, animeQuery);

  // Parse the response to to what slack expects
  if (response.errors) {
    return {
      statusCode: 500,
      body: `Something went wrong with looking up ${bodyParams.text}`,
    };
  }

  const anime = new AnimeModel(response.data.Media);
  const responseText = getResponseText(anime);

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
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

export { handler };
