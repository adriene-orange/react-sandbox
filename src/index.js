import React from 'react';
import { render } from 'react-dom';
import { all } from 'redux-saga/effects';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import toDoListReducer from './toDoList/toDoListReducer';
import toDoListSaga from './toDoList/toDoListSaga';

import App from './app/app';

function* rootSaga () {
    yield all([toDoListSaga()]);
}

const rootReducer = combineReducers({
    todo: toDoListReducer,
});

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