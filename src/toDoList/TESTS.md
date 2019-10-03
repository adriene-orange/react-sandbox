# React test library

The ideology:
"The more your tests resemble the way your software is used, the more confidence they can give you."

## The Pit of Success - duhn duhn duuuuuhn

- Utilities encourage developers to writes tests that match how the react components are used
- Test DOM nodes instead of component instances.
- Utilities are geared towards encouraging semantic html and accessibility.
- API is simple and flexible
- Utilities that interact with the DOM are wrapped the Reacts `act` to better match how React updates the DOM
- Developer tested, React approved - this is now the recommended test library per React docs

## To Do App

```javascript

    test('on initial render it displays a form for adding tasks', () => {
        const { getByPlaceholderText, getByText } = render(<ToDoList />);
        const addTaskInput = getByPlaceholderText('Add a task!', { selector: 'input' });
        const addTaskButton = getByText('Add', { selector: 'button' });

        expect(addTaskInput).toHaveValue('');
        expect(addTaskInput).toBeVisible(); 
        expect(addTaskInput).not.toBeDisabled();  
        
        expect(addTaskButton).toBeVisible(); 
        expect(addTaskButton).not.toBeDisabled(); 
 
    });
```
A good way to test components to to relate them to different points in their life cycle:
- Initial render
- Update - All ways something might trigger an update
- Unmount - when needed
In this first test we focus on what the `ToDoList` component's behavior should be on initial render.
We test for what should render and that the user can interact with them.

Tests like these will not break if implementation changes, like it did in the case where we switched from Class components to Hooks.

Challenge: 
- Try to make the assertions fail by making an implementation change that doesn't change the component's behavior.
- Try to see if you can trick the assertion into passing while changing the component's expected behavior.

## Testing updates/interactions
```javascript

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
```

## Other examples

In some cases, interacting with an element might not produce a change in the current DOM tree. For example some components fire events that update global state. In this case you can leverage `jest.spyOn`

Simple example - Button that console logs clicks
```javascript
    test('Clicking the click button logs clicks', () => {
        const spy = jest.spyOn(console, 'log');
        const ClickButton = () => (
            <button type="button" onClick={() => console.log('click')}>Click Me!</button>
        );
        const { getByText } = render(<ClickButton />);
        fireEvent.click(getByText('Click Me!'));
        expect(spy).toHaveBeenCalledWith('click');
    });
```

In some cases you might want to test how prop changes affect the components behavior.
`rerender` allows you to render the container again. This is great for testing behavior that might be produced from component life cycle methods or hooks.

```javascript

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

```


