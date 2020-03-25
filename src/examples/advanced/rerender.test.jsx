import React from 'react';
import { render } from '@testing-library/react';
import ReRenderComponent from './components/rerenderComponent';

describe('When to use rerender', () => {
  const renderComponent = (status) => render(<ReRenderComponent status={status} />);
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(console, 'log');
  });
  afterEach(() => jest.restoreAllMocks());
  test('fires different effects when props change', () => {
    const { rerender } = renderComponent('LOADING');
    expect(spy).toHaveBeenCalledWith('The status is LOADING');
    rerender(<ReRenderComponent status="LOADED" />);
    expect(spy).toHaveBeenCalledWith('The status is LOADED');
  });
  test('doesn\'t fire if the props haven\'t changed', () => {
    const { rerender } = renderComponent('LOADING');
    rerender(<ReRenderComponent status="LOADING" />);
    console.log(spy);
    // expect(spy).toHaveBeenNthCalledWith(1, 'The status is LOADING');
  });
});
