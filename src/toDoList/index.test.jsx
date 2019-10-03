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
        // expect(addTaskInput).toBeInTheDocument();  // It was rendered
        expect(addTaskInput).toHaveValue('');  // It was initialized properly
        expect(addTaskInput).toBeVisible();   // The user can see it
        expect(addTaskInput).not.toBeDisabled();  // The user can interact with it
        
        expect(addTaskButton).toBeVisible(); // The user can see it
        expect(addTaskButton).not.toBeDisabled(); // The user can interact with it
 
    });
    test('adding a task renders a new list item in the document', () => {
        const { getByPlaceholderText, getByText, getByLabelText } = render(<ToDoList />);
        const addTaskInput = getByPlaceholderText('Add a task!', { selector: 'input' });
        const addTaskButton = getByText('Add', { selector: 'button' });
        const newTask = 'Write tests';

        fireEvent.change(addTaskInput, { target: { value: newTask }});
        fireEvent.click(addTaskButton);

        const newTaskListItem = getByLabelText(`${newTask}`, { exact: false });
        const newTaskSelect = getByLabelText(`${newTask}`, { exact: false, selector: 'select'});

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
        const firstTask = 'Write tests';
        const secondTask = 'Write moar tests';

        // Add the first task
        fireEvent.change(addTaskInput, { target: { value: firstTask }});
        fireEvent.click(addTaskButton);
        // Add another task
        fireEvent.change(addTaskInput, { target: { value: secondTask }});
        fireEvent.click(addTaskButton);

        const newTaskListItem = queryByLabelText(`${firstTask}`, { exact: false });
        const newTaskSelect = queryByLabelText(`${firstTask}`, { exact: false, selector: 'select'});
        const secondTaskListItem = queryByLabelText(`${secondTask}`, { exact: false });
        const secondTaskSelect = queryByLabelText(`${secondTask}`, { exact: false, selector: 'select'});

        expect(newTaskListItem).toBeVisible();
        expect(newTaskSelect).toHaveValue('To do');
        expect(newTaskSelect).toBeVisible();
        expect(newTaskSelect).not.toBeDisabled();

        expect(secondTaskListItem).toBeVisible();
        expect(secondTaskSelect).toHaveValue('To do');
        expect(secondTaskSelect).toBeVisible();
        expect(secondTaskSelect).not.toBeDisabled();

        // update the first task
        fireEvent.change(newTaskSelect, { target: { name: `${firstTask}-1`, value: 'Completed' }});

        expect(queryByLabelText(`${firstTask}`, { exact: false, selector: 'select'})).toHaveValue('Completed');

        // delete the second task -- lets add a test id attribute since there is no unique
        // identifier here
        const deleteButton = getByTestId(`${secondTask}-2-delete`, { exact: true, selector: 'button'});
        fireEvent.click(deleteButton);
    
        expect(queryByLabelText(`${secondTask}`)).not.toBeInTheDocument();
 
    });

    test('Clicking the click button logs clicks', () => {
        const spy = jest.spyOn(console, 'log');
        const ClickButton = () => (
            <button type="button" onClick={() => console.log('click')}>Click Me!</button>
        );
        const { getByText } = render(<ClickButton />);
        fireEvent.click(getByText('Click Me!'));
        expect(spy).toHaveBeenCalledWith('click');
    });
    test('when helloFlag is true it logs hi', () => {
        const spy = jest.spyOn(console, 'log');
        const ClickButton = ({ helloFlag=false }) => {
            React.useEffect(() => {
                if(helloFlag) {
                    console.log('hi');
                }
            }, [helloFlag]);
            return <button type="button" onClick={() => console.log('click')}>Click Me!</button>;
        }
        const { rerender } = render(<ClickButton />);
        // hi was not logged when flag is false
        expect(spy).not.toHaveBeenCalledWith('hi');

        // trigger a re-render
        rerender(<ClickButton helloFlag />);

        expect(spy).toHaveBeenCalledWith('hi');
    });
})