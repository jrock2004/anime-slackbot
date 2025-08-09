import { beforeEach, describe, expect, test, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { mockAnimeResponse, mockErrorResponse } from '../../mocks/data';
import type { HandlerEvent, HandlerContext } from '@netlify/functions';
import { handler } from './anime';

describe('anime handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TOKEN = 'test-token';
  });

  const createMockEvent = (
    body: string | null,
    httpMethod = 'POST'
  ): HandlerEvent => ({
    body,
    httpMethod,
    headers: {},
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    path: '',
    isBase64Encoded: false,
    rawUrl: '',
    rawQuery: '',
  });

  const mockContext: HandlerContext = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test',
    functionVersion: '1',
    invokedFunctionArn: 'test',
    memoryLimitInMB: '128',
    awsRequestId: 'test',
    logGroupName: 'test',
    logStreamName: 'test',
    getRemainingTimeInMillis: () => 1000,
    done: vi.fn(),
    fail: vi.fn(),
    succeed: vi.fn(),
  };

  test('returns 404 for GET requests', async () => {
    const event = createMockEvent(null, 'GET');
    const result = await handler(event, mockContext);

    expect(result).toEqual({ statusCode: 404 });
  });

  test('returns 400 for missing required parameters', async () => {
    const event = createMockEvent('text=&response_url=&token=');
    const result = await handler(event, mockContext);

    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    });
  });

  test('returns 401 for invalid token', async () => {
    const event = createMockEvent(
      'text=naruto&response_url=http://example.com&token=invalid-token'
    );
    const result = await handler(event, mockContext);

    expect(result).toEqual({ statusCode: 401 });
  });

  test('returns 500 when API returns error', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () =>
        HttpResponse.json(mockErrorResponse)
      )
    );

    const event = createMockEvent(
      'text=naruto&response_url=http://example.com&token=test-token'
    );
    const result = await handler(event, mockContext);

    expect(result).toEqual({
      statusCode: 500,
      body: 'Something went wrong with looking up naruto',
    });
  });

  test('returns formatted anime data for successful request', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () =>
        HttpResponse.json(mockAnimeResponse)
      )
    );

    const event = createMockEvent(
      'text=death%20note&response_url=http://example.com&token=test-token'
    );
    const result = await handler(event, mockContext);

    expect(result?.statusCode).toBe(200);
    expect(result?.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(result?.body || '{}');
    expect(body.response_type).toBe('in_channel');
    expect(body.text).toContain('Death Note');
    expect(body.text).toContain('FINISHED');
  });

  test('handles markdown response format', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () =>
        HttpResponse.json(mockAnimeResponse)
      )
    );

    const event = createMockEvent(
      'text=death%20note&response_url=markdown&token=test-token'
    );
    const result = await handler(event, mockContext);

    expect(result?.statusCode).toBe(200);
    const body = JSON.parse(result?.body || '{}');
    expect(body.text).toContain('[Death Note]'); // Markdown format
  });

  test('handles URL encoded search terms with colons', async () => {
    server.use(
      http.post('https://graphql.anilist.co', () =>
        HttpResponse.json(mockAnimeResponse)
      )
    );

    const event = createMockEvent(
      'text=Re%3AZero&response_url=http://example.com&token=test-token'
    );
    await handler(event, mockContext);
  });

  test('handles multiple valid tokens', async () => {
    process.env.TOKEN = 'token1,token2,test-token';
    server.use(
      http.post('https://graphql.anilist.co', () =>
        HttpResponse.json(mockAnimeResponse)
      )
    );

    const event = createMockEvent(
      'text=naruto&response_url=http://example.com&token=token2'
    );
    const result = await handler(event, mockContext);

    expect(result?.statusCode).toBe(200);
  });

  test('handles empty request body', async () => {
    const event = createMockEvent(null);
    const result = await handler(event, mockContext);

    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    });
  });

  test('handles malformed request body gracefully', async () => {
    const event = createMockEvent('invalid-body-format');
    const result = await handler(event, mockContext);

    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required parameters' }),
    });
  });
});
