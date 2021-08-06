import { Handler, HandlerEvent } from '@netlify/functions';

import { bodyParamsType } from './anime.d';

const defaultParams: bodyParamsType = {
  text: '',
  response_url: '',
  token: '',
};

const handler: Handler = async (event: HandlerEvent) => {
  const { body, httpMethod } = event;
  const bodyParams: bodyParamsType = body ? JSON.parse(body) : defaultParams;
  const securityToken: string = process.env.TOKEN;

  console.log(bodyParams);

  if (httpMethod === 'GET') {
    return { statusCode: 404 };
  }

  // Check if params are empty, if so return error
  if (!bodyParams.response_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    };
  }

  // Check if token matches, if not return unauthorized
  if (securityToken !== bodyParams.token) {
    return { statusCode: 401 };
  }

  // TODO: Call the API to get anime info
  // TODO: Parse the response to to what slack expects

  try {
    const subject = 'World';
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello ${subject}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

export { handler };
