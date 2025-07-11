import { CONFIG } from './config';

export interface ApiResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export class ResponseBuilder {
  public static success(data: object): ApiResponse {
    return {
      statusCode: CONFIG.STATUS_CODES.OK,
      headers: {
        'Content-Type': CONFIG.CONTENT_TYPES.JSON,
      },
      body: JSON.stringify(data),
    };
  }

  public static badRequest(message: string): ApiResponse {
    return {
      statusCode: CONFIG.STATUS_CODES.BAD_REQUEST,
      body: JSON.stringify({ message }),
    };
  }

  public static unauthorized(): ApiResponse {
    return {
      statusCode: CONFIG.STATUS_CODES.UNAUTHORIZED,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  public static notFound(): ApiResponse {
    return {
      statusCode: CONFIG.STATUS_CODES.NOT_FOUND,
      body: JSON.stringify({ message: 'Not Found' }),
    };
  }

  public static internalError(message = 'Internal server error'): ApiResponse {
    return {
      statusCode: CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message }),
    };
  }
}
