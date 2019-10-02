# Enzyme - shallow

## What does mount do?
`shallow` is Enzyme's utility for unit testing isolated components. 
From their docs
`Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.`

Shallow does not render to the DOM. Instead it produces an object that has high level data on the component and it's children. You cannot interact with the children and you cannot simulate real DOM events.

## The workshop

You can pull down this branch and run `npm i` and then `npm test` to start up the test suite. Or you can just follow along.

The test file is `./index.shallow.test/jsx`

### Useless tests - it renders without crashing
Once again....
```javascript
test('it renders without crashing', () => {
        const target = shallow(<ToDoList />);
        expect(target).not.toBeNull();
        expect(target).toHaveLength(1);
        expect(target.exists()).toBeTruthy();
        expect(target.instance()).not.toBeNull();
    });
```

### Brittle tests - testing implementation details

Testing for children is even more brittle with shallow.

```javascript
    test('it renders a <StatusSelect> component', () => {
        const target = shallow(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
        expect(target.find('StatusSelect').exists()).toBeTruthy();
    });
```
`shallow` falls prey to the same bad patterns as `mount`, only slightly worse. Changes to the component hiearchy will easily break tests. 

For example go back into StatusSelect and wrap it with `connect()` again.

Our tests now fail, the behavior didn't change, and the only way to fix this test is to change the selector:

```javascript
    test('it renders a <StatusSelect> component', () => {
        const target = shallow(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('Connect(StatusSelect)')).toHaveLength(1);
    });
```

### BDD tests - almost impossible

Shallow rendering doesn't actually produce a DOM like environment. This makes it really light weight but it means testing anything that involves DOM events, navigating, etc... is pretty much impossible. 

Unskip this test in our suite
```javascript
    test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = shallow(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('click', { preventDefault: () => true });

        // const form = target.find('form');
        // form.simulate('submit', { preventDefault: () => true });

         expect(target.find('StatusSelect').text()).toContain('StatusSelect');
    });
```
Notice that the test is failing even though the exact same test passes with `mount`.
Because events don't actually propagate with `shallow` rendering, clicking on the `submitButton` won't actually trigger a submit.

Instead in order to simulate the submit, you have to invoke it on the form.

```javascript
    test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = shallow(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});

        // using form to simulate a submit
        const form = target.find('form');
        form.simulate('submit', { preventDefault: () => true });

         expect(target.find('StatusSelect').text()).toContain('StatusSelect');
    });
```

And then you can't actually assert on the StatusSelect component's value.

To be fair, `shallow` isn't meant for integration level BDD tests. 