import React from 'react';
import uuidV4 from 'uuid/v4';
import faker from 'faker';
import { render } from 'react-dom';
import { Server, Model, Factory } from "miragejs"
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';
import { rootSaga } from './rootSaga';

import App from './app/app';

new Server({
    models: {
        todo: Model,
    },
    factories: {
        todo: Factory.extend({
            // If you want to use createList
            // you HAVE to define these as functions
            id() { return uuidV4() },
            taskDetails(){
                return {
                    value: faker.lorem.word(),
                    uiStatus: 'LOADED',
                    status: 'To do',
                }
            },
        }),
      },
  routes() {
    this.namespace = "api"
    this.get("/todos", (schema) => {
        return schema.todos.all();
    });
    this.post("/todos", (schema, request) => {
        const { todo } = JSON.parse(request.requestBody);
        return schema.todos.create(todo);
    });
    this.put("/todos/:id", (schema, request) => {
        const { id } = request.params;
        const { todo } = JSON.parse(request.requestBody);
        const existingTodo = schema.todos.find(id);
        return existingTodo.update(todo);
    });
    this.delete("/todos/:id", (schema, request) => {
        const { id } = request.params;
        return schema.todos.find(id).destroy();
    });
  },
  seeds(server) {

      const todos = server.createList('todo', 3);
  },
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