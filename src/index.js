import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';
import runMockServer from './mockServer';

import App from './app/app';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  runMockServer();
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = composeWithDevTools(
    applyMiddleware(sagaMiddleware),
  );

  const store = createStore(rootReducer, createStoreWithMiddleware);


  sagaMiddleware.run(rootSaga);
  return store;
};


const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'),
);
