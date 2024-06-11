import { render, screen } from '@testing-library/react';
import * as t from 'io-ts';
import React, { Suspense } from 'react';
import useSwr from 'swr';
import useFetch from './use-fetch';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}));

const TestShape = t.partial({
  testProperty: t.string,
  httpStatus: t.number
});

const TestComponent = () => {
  const blah = useFetch({ url: 'http://localhost:8080', shape: TestShape });

  return <p data-testid="paragraph">{blah.testProperty}</p>;
};

beforeEach(() => {
  (useSwr as jest.Mock).mockImplementation(jest.requireActual('swr').default);
});

it('should return data', async () => {
  const data = 'testValue';
  const response = {
    json: () => Promise.resolve({ testProperty: data })
  } as Response;
  jest.spyOn(global, 'fetch').mockResolvedValue(response);

  render(
    <Suspense fallback={<p>Loading...</p>}>
      <TestComponent />
    </Suspense>
  );

  const paragraphText = (await screen.findByTestId('paragraph')).textContent;
  expect(paragraphText).toBe(data);
});

it('should throw error', () => {
  (useSwr as jest.Mock).mockReturnValue({ error: true });

  expect(() => {
    render(
      <Suspense fallback={<p>Loading...</p>}>
        <TestComponent />
      </Suspense>
    );
  }).toThrow();
});
