import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';
import ToDoList from './index';

describe.skip('<ToDoList/>', () => {
    test('it renders without crashing', () => {
        const target = mount(<ToDoList />);
        expect(target).not.toBeNull();
        expect(target).toHaveLength(1);
        expect(target.exists()).toBeTruthy();
        expect(target.instance()).not.toBeNull();
        expect(target.find('ToDoList')).toHaveLength(1);
    });
    test('it renders a <StatusSelect> component', () => {
        const target = mount(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
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
        expect(target.find('select').instance().value).toEqual(item.status);
    });
    test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = mount(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('click');

        expect(target.find('li').text()).toContain(newTask);
        expect(target.find('li').text()).toContain('To do');

       const secondTask = 'secondTask'
       taskInputField.simulate('change', { target: { value: secondTask }});
       submitButton.simulate('click');

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