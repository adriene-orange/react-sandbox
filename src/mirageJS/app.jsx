import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import ToDoList from './toDoList';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

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

const App = () => (
  <Provider store={store}>
    <ToDoList />
  </Provider>
);

export default App;
