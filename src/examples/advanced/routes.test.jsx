import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RouteComponent from './components/routeComponents';

describe('RouteComponent', () => {
  test('testing for route changes - window.location', () => {
    const { getByText } = render(<RouteComponent />);
    // initial route
    expect(window.location.pathname).toEqual('/');
    const matchLink = getByText('Match');
    // clicked link
    fireEvent.click(matchLink);
    // view changed
    expect(getByText('Miss')).toBeVisible();
    // route changed
    expect(window.location.pathname).toEqual('/miss');
  });
});
