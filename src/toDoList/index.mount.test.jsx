import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';
import ToDoList from './index';

describe.skip('<ToDoList/>', () => {
    // Standard tests seen at QC
    test('it renders without crashing', () => {
        const target = mount(<ToDoList />);
        expect(target).not.toBeNull();
        expect(target).toHaveLength(1);
        expect(target.exists()).toBeTruthy();
        expect(target.instance()).not.toBeNull();
        expect(target.find('ToDoList')).toHaveLength(1);
        // Go into the ToDoList component
        // change the return block to return null
        // why don't these tests fail?
        // mount and shallow both wrap the component
        // when you assert on the return from mount you are asserting on the wrapper
        // the wrapper is the React component, not what the react component renders
       
        // What is the value of testing this?
        // This tests focuses on can we render the component, not what is rendered
        // hence it renders without crashing
        // this is like a sanity check, did we do something dumb that will produce a runtime error on mount?
        
        // Go into the component and throw an exception within the render
        // now the tests will fail

        // This isn't a bad thing to test for, but you automatically get that value when you
        // test for what the component actually renders
        // these tests are confusing and brittle
    });
    // Testing against the react component tree is brittle
    test('it renders a <StatusSelect> component', () => {
        // When we test against the react component tree, anytime we modify the tree
        // we have to adjust our tests - think about HOCs like redux connect
        // they wrap the component we actually want to test with an HOC
        // which means that when we have to look for the component we're trying to test

        const target = mount(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);

        // Try this out - comment out the above code
        //
        // Go into the StatusSelect component, import connect, and then wrap the export
        // export default connect()(StatusSelect);

        // Now uncomment this test block
        // const store = createStore(jest.fn());
        // const target = mount(
        //     <Provider store={store}>
        //         <ToDoList />
        //     </Provider>
        // );
        // // notice that we can't use setState anymore. 
        // // the result of our mount is no longer ToDoList
        // // target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        // // You can fix it by switching to
        // target.find('ToDoList').setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        // expect(target.find('StatusSelect')).toHaveLength(1);

        // // Again, testing against React Components is brittle
        // // Go into Status Select and change the return to null
        // // this test will not fail
        // expect(target.find('StatusSelect')).toHaveLength(1);
        // // vs.
        // expect(target.find('select')).toHaveLength(1);
    });
    // Testing the actual state or props of a component is less important
    // than testing what the component does with state or props
    test('it passes down props to <StatusSelect>', () => {
        const item = {
            id: 'blah-1', task: 'Hi', status: 'Completed'
        };
        const target = mount(<ToDoList />);
        const expectedProps = {
            value: item.status,
            id: item.id,
        };
        target.setState({ items: [item]});
        const statusSelectProps = target.find('StatusSelect').props();
        expect(statusSelectProps.value).toEqual(expectedProps.value);
        expect(statusSelectProps.id).toEqual(expectedProps.id);

        // once again change the return statement to return null
        // these tests will still pass

        // a better way of testing is to actually test what the component is doing with the props
        // however to actually get at the attribute we want to test for we have to invoke instance()
        // because find() always returns a ReactWrapper
        expect(target.find('select').instance().value).toEqual(item.status);
    });

    // What does doing BDD with Enzyme mount look like?
    test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = mount(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('submit');

        expect(target.find('li').text()).toContain(newTask);
        expect(target.find('li').text()).toContain('To do');

        // What difficulties come up though when we have more than one list item?
        // uncomment the below text

        // Add anothertask
       const secondTask = 'secondTask'
       taskInputField.simulate('change', { target: { value: secondTask }});
       submitButton.simulate('submit');

        // find() doesn't handle multiple instances very well
        // expect(target.find('li').text()).toContain(secondTask);
        // expect(target.find('li').text()).toContain('To do');

        // You can solve this if you know the index of the list item
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
    
})