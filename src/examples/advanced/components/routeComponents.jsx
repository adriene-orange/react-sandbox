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

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  app: () => [],
});

const generateStore = (preloadedState = {}) => {
  const history = createBrowserHistory();
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(
      routerMiddleware(history),
    ),
  );
  return { store, history };
};

const { store, history } = generateStore();

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={() => (<Link to="/miss">Match</Link>)} />
        <Route path="/miss" render={() => (<Link to="/">Miss</Link>)} />
      </Switch>
    </ConnectedRouter>
  </Provider>
);
