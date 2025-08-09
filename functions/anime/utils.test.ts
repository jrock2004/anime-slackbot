import { expect, test } from 'vitest';
import { mockAnimeData } from '../../mocks/data';
import { getResponseText } from './utils';

test('get response text with markdown off has slack syntax', () => {
  const results = getResponseText(mockAnimeData, false);

  expect(results.trim()).not.toContain('[Death Note]');
});

test('get response text with markdown on has markdown syntax', () => {
  const results = getResponseText(mockAnimeData, true);

  expect(results.trim()).toContain('[Death Note]');
});
