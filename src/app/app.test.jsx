import { waitForElement, fireEvent } from '@testing-library/react';
import { renderWithMiddleware } from '../testUtils';
import App from './app';
import { addToDoService } from '../toDoList/toDoServices';
jest.mock('../toDoList/toDoServices');

describe('<App />', () => {
    test('initial render displays an input form, button and title', () => {
        const { getByText, getByPlaceholderText } = renderWithMiddleware({
            Component: App,
        });
        expect(getByText('Add a task!')).toBeVisible();
        expect(getByPlaceholderText('Add a task!')).toBeEnabled();
        expect(getByText('Add')).toBeVisible();
    });
    test('adding a new task renders a placeholder item that resolves to the expected task', async () => {
        addToDoService.mockImplementation(() => Promise.resolve());
        const { getByText, getByPlaceholderText } = renderWithMiddleware({
            Component: App,
        });
        const addTakeInput = getByPlaceholderText('Add a task!');
        const addButton = getByText('Add');
        fireEvent.change(addTakeInput, { target: { value: 'Write tests' } });
        fireEvent.click(addButton);

        expect(getByText('Processing Task...')).toBeVisible();

        const newTask = await waitForElement(() => getByText('Write tests', { exact: false }));
        expect(newTask).toBeVisible();
    })
})