import React from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './rootReducer';
import Root from './components/Root';
import Count from './components/Count';
import scanSaga from './sagas/scan';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

const App = () => (
    <Provider store={store}>
        <Root />
        <Count />
    </Provider>
);

sagaMiddleware.run(scanSaga)

export default App;