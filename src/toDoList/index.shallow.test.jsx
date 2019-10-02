import React from 'react';
import { shallow } from 'enzyme';
import ToDoList from './index';

describe('<ToDoList/>', () => {
    // Standard tests seen at QC
    test('it renders without crashing', () => {
        const target = shallow(<ToDoList />);
        expect(target).not.toBeNull();
        expect(target).toHaveLength(1);
        expect(target.exists()).toBeTruthy();
        expect(target.instance()).not.toBeNull();
    });
    // Testing against the react component tree is even more brittle with shallow
    test('it renders a <StatusSelect> component', () => {
        const target = shallow(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
        // expect(target.find('Connect(StatusSelect)')).toHaveLength(1);
    });
    test.skip('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = shallow(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('click', { preventDefault: () => true });

         expect(target.find('StatusSelect').text()).toContain('StatusSelect');

    });
    
})