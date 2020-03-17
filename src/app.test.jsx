import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import App from './app';
import runMockServer from './mockServer';

describe('ToDo List App', () => {
  let server;
  beforeEach(() => {
    server = runMockServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });
  const FIRST_RENDER = 'an empty input and initial todo tasks are displayed';
  const ADDING_TODO = 'renders a todo card after adding a new task';
  test(FIRST_RENDER, async () => {
    server.createList('todo', 3);
    const {
      getAllByTestId,
      getByPlaceholderText,
    } = render(React.createElement(App));
    const todos = await waitForElement(() => getAllByTestId('todo-cards'));
    expect(todos).toHaveLength(3);
    const addNewTaskInput = getByPlaceholderText('Add a task!');
    fireEvent.change(addNewTaskInput, { target: { value: 'Write tests' } });
    fireEvent.submit(addNewTaskInput);
  });
  test(ADDING_TODO, async () => {
    server.createList('todo', 3);
    const {
      getAllByTestId,
      getByPlaceholderText,
    } = render(React.createElement(App));
    const todos = await waitForElement(() => getAllByTestId('todo-cards'));
    const addNewTaskInput = getByPlaceholderText('Add a task!');
    fireEvent.change(addNewTaskInput, { target: { value: 'Write tests' } });
    fireEvent.submit(addNewTaskInput);
    expect(todos).toHaveLength(3);
  });
});
