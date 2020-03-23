import React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import faker from 'faker';
import App from '../../mirageJS/app';
import * as ToDoServices from '../../mirageJS/toDoList/toDoServices';

jest.mock('../../mirageJS/toDoList/toDoServices');

const mockToDoFactory = (id, uiStatus = 'LOADED', status = 'To do') => ({
  id,
  taskDetails: {
    value: faker.lorem.word(),
    uiStatus,
    status,
  },
});

describe('ToDo List App', () => {
  afterAll(() => {
    jest.resetModules();
  });
  const FIRST_RENDER = 'an empty input and initial todo tasks are displayed';
  const ADDING_TODO = 'renders a todo card after adding a new task';

  test(FIRST_RENDER, async () => {
    // mock out our api requests
    ToDoServices.fetchAllTodosService.mockResolvedValue({
      todos: [
        mockToDoFactory(1),
        mockToDoFactory(2),
        mockToDoFactory(3),
      ],
    });
    const {
      getAllByTestId,
    } = render(React.createElement(App));
    await waitFor(() => expect(getAllByTestId('todo-cards')).toHaveLength(3));
  });
  test(ADDING_TODO, async () => {
    ToDoServices.fetchAllTodosService.mockResolvedValue({
      todos: [
        mockToDoFactory(1),
        mockToDoFactory(2),
        mockToDoFactory(3),
      ],
    });
    ToDoServices.addToDoService.mockResolvedValue({ body: {} });
    const {
      getByTestId,
      getAllByTestId,
      getByPlaceholderText,
    } = render(React.createElement(App));
    const addNewTaskInput = getByPlaceholderText('Add a task!');
    const addTaskButton = getByTestId('add-button');
    fireEvent.change(addNewTaskInput, { target: { value: 'Write tests' } });
    fireEvent.click(addTaskButton);
    // A little bit of trickiness here. waitForElement will wait for the first
    // render that has our todo-cards, switching to wait and using an expect
    // makes the test wait for the assertion to be true
    await waitFor(() => expect(getAllByTestId('todo-cards')).toHaveLength(4));
  });
});
