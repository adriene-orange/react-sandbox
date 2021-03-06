import uuidV4 from 'uuid/v4';
import faker from 'faker';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Model, Factory } from 'miragejs';

const makeToDOServer = (environment) => {
  return new Server({
    environment,
    models: {
      todo: Model,
    },
    factories: {
      todo: Factory.extend({
      // If you want to use createList
      // you HAVE to define these as functions
        id() { return uuidV4(); },
        taskDetails() {
          return {
            value: faker.lorem.word(),
            uiStatus: 'LOADED',
            status: 'To do',
          };
        },
      }),
    },
    routes() {
      this.namespace = 'api';
      this.get('/todos', (schema) => schema.todos.all());
      this.post('/todos', (schema, request) => {
        const { todo } = JSON.parse(request.requestBody);
        return schema.todos.create(todo);
      });
      this.put('/todos/:id', (schema, request) => {
        const { id } = request.params;
        const { todo } = JSON.parse(request.requestBody);
        const existingTodo = schema.todos.find(id);
        return existingTodo.update(todo);
      });
      this.delete('/todos/:id', (schema, request) => {
        const { id } = request.params;
        return schema.todos.find(id).destroy();
      });
    },
    seeds(server) {
      server.createList('todo', 3);
    },
  });
};

export default ({ environment = 'development' } = {}) => makeToDOServer(environment);
