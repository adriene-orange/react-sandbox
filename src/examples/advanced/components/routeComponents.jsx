import React from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import {
  applyMiddleware, createStore, combineReducers,
} from 'redux';
import { ConnectedRouter, routerMiddleware, connectRouter } from 'connected-react-router';
import {
  Route,
  Switch,
  Link,
} from 'react-router-dom';

export const generateStore = (preloadedState = {}, reducers = {}) => {
  const history = createBrowserHistory();
  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      ...reducers,
    }),
    preloadedState,
    applyMiddleware(
      routerMiddleware(history),
    ),
  );
  return { store, history };
};

const appReducers = {
  app: () => ({ text: 'Dummy state' }),
};

const { store, history } = generateStore(undefined, appReducers);

const Wrapper = ({ children }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {children}
    </ConnectedRouter>
  </Provider>
);

export const InnerRoutes = () => (
  <Switch>
    <Route exact path="/" render={() => (<Link to="/miss">Match</Link>)} />
    <Route path="/miss" render={() => (<Link to="/">Miss</Link>)} />
  </Switch>
);

const App = () => (
  <Wrapper>
    <Switch>
      <InnerRoutes />
    </Switch>
  </Wrapper>
);

export default App;
