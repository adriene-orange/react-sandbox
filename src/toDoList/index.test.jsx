import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ToDoList from './index';

describe('<ToDoList />', () => {
    test('it displays a form for adding tasks', () => {
        const { getByPlaceholderText, getByText } = render(<ToDoList />);
        // Queries takes options as a second param
        // You don't need these usually but adding in a selector that specifies what
        // you are looking for can make the test more resilient, especially if text isn't unique
        const addTaskInput = getByPlaceholderText('Add a task!', { selector: 'input' });
        const addTaskButton = getByText('Add', { selector: 'button' });

        // Lets assert about what is important
        expect(addTaskInput).toBeInTheDocument();  // It was rendered
        expect(addTaskInput).toHaveValue('');  // It was initialized properly
        expect(addTaskInput).toBeVisible();   // The user can see it
        expect(addTaskInput).not.toBeDisabled();  // The user can interact with it
        
        expect(addTaskButton).toBeInTheDocument(); // It was rendered
        expect(addTaskButton).toBeVisible(); // The user can see it
        expect(addTaskButton).not.toBeDisabled(); // The user can interact with it

        // Test this out. Go into index.jsx and change the return type to null
        // Remove the input or pass in disabled as a property
        // These tests will now fail.
 
    });
    test('adding a task renders a new list item in the document', () => {
        const { getByPlaceholderText, getByText, getByLabelText } = render(<ToDoList />);
        const addTaskInput = getByPlaceholderText('Add a task!', { selector: 'input' });
        const addTaskButton = getByText('Add', { selector: 'button' });
        const newTask = 'Write tests';
        const secondTask = 'Write moar tests';

        fireEvent.change(addTaskInput, { target: { value: newTask }});
        fireEvent.click(addTaskButton);

        const newTaskListItem = getByLabelText(`${newTask}`, { exact: false });
        const newTaskSelect = getByLabelText(`${newTask}`, { exact: false, selector: 'select'});

        expect(newTaskListItem).toBeInTheDocument();
        expect(newTaskListItem).toBeVisible();

        expect(newTaskSelect).toHaveValue('To do');
        expect(newTaskSelect).toBeVisible();
        expect(newTaskSelect).not.toBeDisabled();
 
    });
    // Full BDD
    test('adding, updating and deleting tasks works', () => {
        const { getByPlaceholderText, getByText, queryByLabelText, getByTestId } = render(<ToDoList />);
        const addTaskInput = getByPlaceholderText('Add a task!', { selector: 'input' });
        const addTaskButton = getByText('Add', { selector: 'button' });
        const newTask = 'Write tests';
        const secondTask = 'Write moar tests';

        fireEvent.change(addTaskInput, { target: { value: newTask }});
        fireEvent.click(addTaskButton);

        const newTaskListItem = queryByLabelText(`${newTask}`, { exact: false });
        const newTaskSelect = queryByLabelText(`${newTask}`, { exact: false, selector: 'select'});

        expect(newTaskListItem).toBeInTheDocument();
        expect(newTaskListItem).toBeVisible();

        expect(newTaskSelect).toHaveValue('To do');
        expect(newTaskSelect).toBeVisible();
        expect(newTaskSelect).not.toBeDisabled();

        // Add another task
        fireEvent.change(addTaskInput, { target: { value: secondTask }});
        fireEvent.click(addTaskButton);

        const secondTaskListItem = queryByLabelText(`${secondTask}`, { exact: false });
        const secondTaskSelect = queryByLabelText(`${secondTask}`, { exact: false, selector: 'select'});

        expect(secondTaskListItem).toBeInTheDocument();
        expect(secondTaskListItem).toBeVisible();

        expect(secondTaskSelect).toHaveValue('To do');
        expect(secondTaskSelect).toBeVisible();
        expect(secondTaskSelect).not.toBeDisabled();

        // update the first task
        fireEvent.change(newTaskSelect, { target: { name: `${newTask}-1`, value: 'Completed' }});

        expect(queryByLabelText(`${newTask}`, { exact: false, selector: 'select'})).toHaveValue('Completed');

        // delete the second task -- lets add a test id attribute since there is no unique
        // identifier here
        const deleteButton = getByTestId(`${secondTask}-2-delete`, { exact: true, selector: 'button'});
        fireEvent.click(deleteButton);
    
        expect(queryByLabelText(`${secondTask}`)).not.toBeInTheDocument();
 
    });
})