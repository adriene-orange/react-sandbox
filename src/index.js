import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

import App from './app/app';


const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();

    const createStoreWithMiddleware = composeWithDevTools(
        applyMiddleware(sagaMiddleware),
    );

    const store = createStore(rootReducer, createStoreWithMiddleware);


    sagaMiddleware.run(rootSaga);
    return store;
}


const store = configureStore();

render(
    <Provider store={store}>
        <React.Fragment>
            <App />
        </React.Fragment>
    </Provider>, document.getElementById('root'));