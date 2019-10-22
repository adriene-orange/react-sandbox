import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { render } from '@testing-library/react';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

const generateStore = (initialState) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(sagaMiddleware),
    ) || {};
    sagaMiddleware.run(rootSaga);
    return store;
};

export const renderWithMiddleware = ({ Component, props, initialState, store = generateStore(initialState) }, renderMethod = render) => {
    const container = renderMethod(
        <Provider store={store}>
            <Component {...props} />
        </Provider>,
    );
    // If needed for rerendering a component manually, matches the contract of renderWithMiddleware
    // except that it will pass the original store, preventing a new one from being created
    const rerenderWithMiddleware = (options) => {
        if (options.initialState && typeof options.initialState === 'object') {
            const newState = { ...store.getState(), ...initialState };
            store.replaceReducer(() => newState)
        }
        renderWithMiddleware({ ...options, store }, container.rerender);
    }
    return {
        store,
        ...container,
        rerenderWithMiddleware,
       rerender: undefined, // This is to prevent developers from trying to use the unwrapped rerender which will be broken
    };
};