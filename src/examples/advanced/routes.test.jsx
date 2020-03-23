import React from 'react';
import {
  MemoryRouter, Route, Link, Switch,
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import RouteComponent, {
  generateStore,
  InnerRoutes,
} from './components/routeComponents';

const clearWindowHistory = () => window.history.replaceState(null, '', '/');

describe('RouteComponent', () => {
  afterEach(() => clearWindowHistory());
  test('testing for route changes - MemoryRouter', () => {
    // Keep a copy of the location
    let localLocation;
    const ComponentToTest = () => (
      // MemoryRouter as wrapper
      <MemoryRouter initialEntries={['/']}>
        <Switch>
          <Route
            exact
            path="/"
            render={
              ({ location }) => {
                // For every route you have to overwrite the location
                localLocation = location;
                return (<Link to="/miss">Match</Link>);
              }
          }
          />
          <Route
            exact
            path="/miss"
            render={
            ({ location }) => {
              localLocation = location;
              return (<Link to="/match">Miss</Link>);
            }
            }
          />
        </Switch>
      </MemoryRouter>

    );
    const { getByText } = render(<ComponentToTest />);
    // initial route
    expect(localLocation.pathname).toEqual('/');
    const matchLink = getByText('Match');
    // clicked link
    fireEvent.click(matchLink);
    // view changed
    expect(getByText('Miss')).toBeVisible();
    // route changed
    expect(localLocation.pathname).toEqual('/miss');
  });
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
  test('testing for route changes - history object', () => {
    const { store, history } = generateStore();
    const Wrapper = ({ children }) => (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {children}
        </ConnectedRouter>
      </Provider>
    );

    const { getByText } = render(<InnerRoutes />, { wrapper: Wrapper });
    // initial route
    expect(history.location.pathname).toEqual('/');
    const matchLink = getByText('Match');
    // clicked link
    fireEvent.click(matchLink);
    // view changed
    expect(getByText('Miss')).toBeVisible();
    // route changed
    expect(history.location.pathname).toEqual('/miss');
  });
});
