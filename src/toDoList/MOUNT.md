# Enzyme - mount

## What does mount do?
`mount` is Enzyme's utility for full DOM rendering. `mount` takes in a React Element as its first argument and an array of options as its second. It returns a React Wrapper instance.

## The workshop

You can pull down this branch and run `npm i` and then `npm test` to start up the test suite. Or you can just follow along.

The test file is `./index.mount.test/jsx`

### Useless tests - it renders without crashing
The very first suite is one of the most common tests seen at QuoteCenter
Each of the expect statements are a variation of how developers test if a component mounted.
```javascript
test('it renders without crashing', () => {
        const target = mount(<ToDoList />);
        expect(target).not.toBeNull();
        expect(target).toHaveLength(1);
        expect(target.exists()).toBeTruthy();
        expect(target.instance()).not.toBeNull();
        expect(target.find('ToDoList')).toHaveLength(1);
    });
```
However, this test on its own is pretty much useless.
The test description itself isn't very useful. What does it renders without crashing mean? What is target?

Go into the ToDoList component `./index.jsx` and change the return statement to null.
You'll see that our above expect statements will all sill pass.
This is because we are asserting on the React Wrapper and not what the component actually renders.
What is the value of `it renders without crashing` or how do we make this test fail?
In the component's `render()` block, throw an exception.
Now the tests will fail.
However, it's not our assertions that are failing - it's `mount`;

Change the test to 

```javascript
test('it renders without crashing', () => {
        mount(<ToDoList />);
    });
```
And the tests still fail. Our assertion will never be reached.
Pulling this out as its own test doesn't add very much value any test that tries to render the component will fail. 

Revert your changes and now look at the next test.

### Brittle tests - testing implementation details

```javascript
    test('it renders a <StatusSelect> component', () => {
        const target = mount(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
    });

```

One of the most common selector types used with `enzyme` is a React Component. However, finding a component in the tree by a React Component is very brittle for multiple reasons.

One of the first and obvious signs of brittlness is in the case where the component name changes.

Go into the `StatusSelect` component. Change the name of the `StatusSelect` component to `SelectStatus`;

Now our tests fail, even though the functionality of the component did not change or break.

Additionally even if you did change the component the assert statement

`expect(target.find('StatusSelect')).toHaveLength(1);`

is made against the StatusSelect React Wrapper. If you went into the child component and changed the return value to null, this test would still pass. 

Changes to the tree hiearchy can also produce brittle tests. For example if you wrap a component with a higher order component like `connect()`;

Go into `StatusSelect` and wrap the export statement with `connect()`


```javascript
export default connect()(StatusSelect);
```

Also change the test suite to

```javascript

 test('it renders a <StatusSelect> component', () => {
        const store = createStore(jest.fn());
        const target = mount(
            <Provider store={store}>
                <ToDoList />
            </Provider>
        );
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
    });
```

Notice target doesn't have access to `setState` anymore. This is because mount is no longer returning the React Wrapper for `ToDoList`, it is handing you the component wrapper for redux connect.
In order to fix the test you would need to select the `ToDoList` component. Or export the component without the connect() wrapper.

```javascript

 test('it renders a <StatusSelect> component', () => {
        const store = createStore(jest.fn());
        const target = mount(
            <Provider store={store}>
                <ToDoList />
            </Provider>
        );
        target.find('ToDoList').setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
    });
```

Calling Component functions directly is brittle. In our example we use `setState` directly to trigger changes in the component. 
However, if we refactored this component and changed it to use hooks:

```javascript
const ToDoList = () => {
    const [state, setState] = useState({ currentTask: '', items: [] });
    const addTaskToList = (e) => {
        e.preventDefault();
        const { items, currentTask } = state;
        const id = `${currentTask}-${items.length + 1}`;
        const newToDo = {
            id,
            task: currentTask,
            status: 'To do',
        };
        return setState({ currentTask: '', items: [ ...items, newToDo   ] });
    }

    const onChangeHandler = (e) => {
        const task = e.target.value;
        return setState({
            ...state,
            currentTask: task
        });
    }

    const removeTaskFromList = (event) => {
        const taskId = event.target.name;
        const { items } = state;
        const filteredList = items.filter(({ id }) => id !== taskId);
        return setState({ items: filteredList });
    }
    const updateTaskStatus = (event) => {
        const taskId = event.target.name;
        const status = event.target.value;
        const { items } = state;
        const taskIndex = findIndex(items, ({ id }) => id === taskId);;
        if (taskIndex >= 0) {
            const updatedTask = { ...items[taskIndex], status };
            const newItems = [
                ...items,
            ];
            newItems[taskIndex] = updatedTask;
            return setState({
                items: newItems
            })
        }
    }

    const { currentTask, items } = state;

    const listItemStyle = {
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center'
    };
    const containerStyle = {
        display: 'flex',
        flex:'0 0 auto',
        flexFlow: 'column wrap',
        border: '2px solid grey',
        height: '100vh',
    };
    return (
        <div style={containerStyle}>
            <label htmlFor="add-to-do" style={{padding: '30px'}}>
                <h2>Add a task!</h2>
                <form id="add-to-do" onSubmit={addTaskToList}>
                    <input value={currentTask} onChange={onChangeHandler} type="text" placeholder="Add a task!"/>
                    &nbsp;
                    <button type="submit">Add</button>
                </form>
            </label>
            {
                items && items.length > 0 && (
                    <ul>
                    {
                        items.map(({ id, task, status }) => (
                            <li key={id}>
                                <label htmlFor={id} style={listItemStyle}>
                                    <h3>{task}-{status}</h3>
                                    &nbsp;
                                    <StatusSelect id={id} value={status} onChange={updateTaskStatus} />
                                    &nbsp;
                                    <button name={id} type="button" onClick={removeTaskFromList}>Delete</button>
                                </label>
                            </li>
                        ))
                    }
                </ul>

                )
            }
        </div>
    )
}
```

The tests now fail because `setState` can only be invoked from a Class component. However, the actual behavior of the component didn't change. 

To summarize, we need to keep implementation details out of our tests and instead focus on the behavior of our components. 

Bad Patterns
- Component rendered without crashing
- Calling `setState` or `setProps`
- Testing prop values
- Testing for css class names
- Using the React Component as your selector

What do good React tests look like?

## BDD
If we want tests that actually build confidence we need to test the behavior of our components.

See the comments in this snippet:
```javascript
test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = mount(<ToDoList />);
        // use html selectors to test what the component is rendering
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Interact with the DOM the way a user would
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('submit');

        // assert that interacting with the DOM produces the expected change in the DOM
        expect(target.find('li').text()).toContain(newTask);
        expect(target.find('li').text()).toContain('To do');

        // Add anothertask
       const secondTask = 'secondTask'
       taskInputField.simulate('change', { target: { value: secondTask }});
       submitButton.simulate('submit');
       expect(target.find('li').at(1).text()).toContain(secondTask);

       // Lets test updating the status of the first 
       const firstStatusSelect = target.find('select').at(0);
       firstStatusSelect.simulate('change', { target: { name: 'newTask-1', value: 'Completed' }});

       expect(target.find('li').at(0).text()).toContain(newTask);
       expect(target.find('li').at(0).text()).toContain('Completed');

       // Now lets delete the second task
       const secondDeleteButton = target.find('button[name="secondTask-2"]');
       secondDeleteButton.simulate('click');

       expect(target.find('li').at(1).exists()).toBeFalsy();
    });

```

## Other notes

### Clean up

From the `enzyme` docs:

```
Note: unlike shallow or static rendering, full rendering actually mounts the component in the DOM, which means that tests can affect each other if they are all using the same DOM. Keep that in mind while writing your tests and, if necessary, use .unmount() or something similar as cleanup.
```
