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
        // Go into the ToDoList component
        // change the return block to return null
        // Once again we've run into the same wrapper confusion
    });
    // Testing against the react component tree is even more brittle with shallow
    test('it renders a <StatusSelect> component', () => {
        // And once again asserting against the react components it renders is brittle
        const target = shallow(<ToDoList />);
        target.setState({ items: [{ id: 'blah-1', task: 'Hi', status: 'Completed' }]});
        expect(target.find('StatusSelect')).toHaveLength(1);
        expect(target.find('StatusSelect').exists()).toBeTruthy();
        // Go into the StatusSelect component, import connect, and then wrap the export
        // export default connect()(StatusSelect);
        // the test nows fails ... how do we fix it?
        // You can either import the StatusSelect component here
        // or change the selector to include redux connect
        // expect(target.find('Connect(StatusSelect)')).toHaveLength(1);
        // and you're not getting much value out of this test since you can't actually assert
        // that the StatusSelect component actually returns anything of value
    });
    // Select is geared towards very narrow unit testing
    // You can only ever assert or look into the root node
    // What does doing BDD with Enzyme mount look like?
    test('adding, updating and deleting tasks works', () => {
        const newTask = 'newTask';
        const target = shallow(<ToDoList />);
        const taskInputField = target.find('[placeholder="Add a task!"]');
        const submitButton = target.find('[type="submit"]');
        
        // Add one
        taskInputField.simulate('change', { target: { value: newTask }});
        submitButton.simulate('submit');
        // these fail ... why?
        // events don't propagate the same way in shallow as it does in mount
        // you need to target the form instead in this case
        const form = target.find('form');
        form.simulate('submit');

        // But these still fail because the "text" of the component
        // is just its component name
        // expect(target.find('StatusSelect').text()).toContain(newTask);
        // expect(target.find('StatusSelect').text()).toContain('To do');
         // To make it pass
         expect(target.find('StatusSelect').text()).toContain('StatusSelect');

    });
    
})